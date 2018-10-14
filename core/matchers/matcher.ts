import { MatchError } from "../errors";
import { TypeMatcher } from "../spying";
import { stringify } from "../stringification";
import { diff } from "deep-diff";
import { diffChars, diffWords, diffArrays } from "diff";
import chalk from "chalk";

function diffString(a: string, b: string) {
  const diffs =
    /\s/.test(a) || /\s/.test(b) ? diffWords(a, b) : diffChars(a, b);
  return diffs
    .map(
      x =>
        x.added
          ? chalk.green(x.value)
          : x.removed
            ? chalk.red(x.value)
            : x.value
    )
    .join("");
}

function buildDiff(
  diffs: Array<deepDiff.IDiff>,
  parentProperty: string
): string {
  if (diffs.length === 0) {
    return "no differences";
  } else if (diffs.length === 1 && diffs[0].path === undefined) {
    const onlyDiff = diffs[0];

    if (onlyDiff.kind === "E") {
      return diffString(
        JSON.stringify(onlyDiff.lhs),
        JSON.stringify(onlyDiff.rhs)
      );
    }

    return chalk.green(onlyDiff.lhs || onlyDiff.rhs);
  }
  // probably an array
  else if (diffs.every(x => x.path === undefined)) {
    return `[\n${diffs.map(d => buildDiff([d], `[${d.index}]`)).join("\n")}\n]`;
  }

  const depth = (parentProperty.match(/\./g) || []).length + 1;
  const padding = new Array(depth).join("  ");

  const deeperDiffs = diffs
    .filter(d => d.path && d.path.length - 1 > depth)
    .reduce(
      (concat, d) => {
        const prop = d.path[depth];
        const value = concat[prop];
        concat[prop] = value ? [...value, d] : [d];
        return concat;
      },
      {} as { [p: string]: Array<deepDiff.IDiff> }
    );

  return (
    `${padding}${diffs[0].path[depth - 1]}: {\n` +
    diffs
      .filter(d => d.path.length - 1 === depth)
      .map(d => stringifyDiffProp(d, padding + "  "))
      .join(",\n") +
    Object.keys(deeperDiffs).map(key =>
      buildDiff(deeperDiffs[key], parentProperty + "." + key)
    ) +
    `\n${padding}}\n`
  );
}

function stringifyDiffProp(diffInfo: deepDiff.IDiff, padding: string) {
  if (diffInfo.kind === "N") {
    return chalk.green(
      `+ ${padding}${diffInfo.path[diffInfo.path.length - 1] ||
        ""}: ${JSON.stringify(diffInfo.rhs)}`
    );
  } else if (diffInfo.kind === "D") {
    return chalk.red(
      `- ${padding}${diffInfo.path[diffInfo.path.length - 1] ||
        ""}: ${JSON.stringify(diffInfo.lhs)}`
    );
  } else if (diffInfo.kind === "E") {
    return `  ${padding}${diffInfo.path[diffInfo.path.length - 1] ||
      ""}: "${diffString(diffInfo.lhs, diffInfo.rhs)}"`;
  }
}

/**
 * Gives functionality to ensure the outcome of a test is as expected
 */
export class Matcher<T> {
  protected get actualValue(): T {
    return this._actualValue;
  }
  protected get shouldMatch(): boolean {
    return this._shouldMatch;
  }

  /**
   * Any subsequent matcher function will be looking for the opposite criteria
   */
  public get not(): this {
    this._shouldMatch = !this.shouldMatch;
    return this;
  }
  private _actualValue: T;

  private _shouldMatch: boolean = true;

  public constructor(actualValue: T) {
    this._actualValue = actualValue;
  }

  /**
   * Checks that a value is identical to another
   * @param expectedValue - the value that will be used to match
   */
  public toBe(expectedValue: T) {
    this._registerMatcher(
      (expectedValue === this._actualValue) === this.shouldMatch,
      `Expected ${stringify(this.actualValue)} ${
        !this.shouldMatch ? "not " : ""
      }` + `to be ${stringify(expectedValue)}.`,
      expectedValue
    );
  }

  /**
   * Checks that a value is equal to another (for objects the function will check for deep equality)
   * @param expectedValue - the value that will be used to match
   */
  public toEqual(expectedValue: any) {
    let valueMatch: boolean;

    if (expectedValue instanceof TypeMatcher) {
      valueMatch = expectedValue.test(this._actualValue);
    } else if (Buffer.isBuffer(expectedValue)) {
      valueMatch = this._checkBuffersAreEqual(expectedValue, this._actualValue);
    } else if (expectedValue instanceof Object) {
      valueMatch = this._checkObjectsAreDeepEqual(
        expectedValue,
        this._actualValue
      );
    } else {
      // exclude the double equals in this case from review
      // as this is what we want to do
      // tslint:disable-next-line:triple-equals
      valueMatch = expectedValue == this._actualValue;
    }

    this._registerMatcher(
      valueMatch === this._shouldMatch,
      `Expected ${stringify(this.actualValue)} ${
        !this.shouldMatch ? "not " : ""
      }` + `to be equal to ${stringify(expectedValue)}.`,
      expectedValue,
      {
        diff: this._diff(expectedValue, this._actualValue)
      }
    );
  }

  /**
   * Checks that a value is not undefined
   */
  public toBeDefined() {
    this._registerMatcher(
      (this._actualValue !== undefined) === this.shouldMatch,
      `Expected ${stringify(this.actualValue)} ${
        this.shouldMatch ? "not " : ""
      }` + `to be undefined.`,
      undefined
    );
  }

  /**
   * Checks that a value is null
   */
  public toBeNull() {
    this._registerMatcher(
      (this._actualValue === null) === this.shouldMatch,
      `Expected ${stringify(this.actualValue)} ${
        !this.shouldMatch ? "not " : ""
      }` + `to be null.`,
      null
    );
  }

  /**
   * Checks that a value is equivalent to boolean true
   */
  public toBeTruthy() {
    this._registerMatcher(
      (this._actualValue && this.shouldMatch) ||
        (!this._actualValue && !this.shouldMatch),
      `Expected ${stringify(this.actualValue)} ${
        !this.shouldMatch ? "not " : ""
      }to be truthy.`,
      this.shouldMatch ? "truthy" : "falsy"
    );
  }

  protected _registerMatcher(
    isMatch: boolean,
    failureMessage: string,
    expectedValue: any,
    extras?: { [prop: string]: any }
  ) {
    if (isMatch === false) {
      throw new MatchError(
        failureMessage,
        expectedValue,
        this._actualValue,
        extras
      );
    }
  }

  private _diff(a: any, b: any) {
    if (typeof a === "string") {
      return diffString(a, b);
    }

    return buildDiff(diff(a, b) || [], "");
  }

  private _checkBuffersAreEqual(buffer: Buffer, other: any): boolean {
    // Buffer.from() only accepts of type string, Buffer, ArrayBuffer, Array, or Array-like Object.
    if (this._isBufferable(other)) {
      const otherBuffer = Buffer.isBuffer(other)
        ? other
        : Buffer.from(other as string); // Typings don't know that Buffer.from() can accept ArrayLike<T>

      return buffer.equals(otherBuffer);
    } else {
      return false;
    }
  }

  private _checkObjectsAreDeepEqual(objectA: any, objectB: any): boolean {
    // if one object is an array and the other is not then they are not equal
    if (Array.isArray(objectA) !== Array.isArray(objectB)) {
      return false;
    }

    // get all the property keys for each object
    const OBJECT_A_KEYS = Object.keys(objectA);
    const OBJECT_B_KEYS = Object.keys(objectB);

    // if they don't have the same amount of properties then clearly not
    if (OBJECT_A_KEYS.length !== OBJECT_B_KEYS.length) {
      return false;
    }

    // check all the properties of each object
    for (const objectAKey of OBJECT_A_KEYS) {
      // if the property values are not the same
      if (objectA[objectAKey] !== objectB[objectAKey]) {
        // and it's not an object or the objects are not equal
        if (
          typeof objectA[objectAKey] !== "object" ||
          this._checkObjectsAreDeepEqual(
            objectA[objectAKey],
            objectB[objectAKey]
          ) === false
        ) {
          // then not deep equal
          return false;
        }
      }
    }

    // all properties match so all is good
    return true;
  }

  private _isBufferable(
    obj: any
  ): obj is string | Buffer | Array<any> | ArrayBuffer | ArrayLike<any> {
    return (
      "string" === typeof obj ||
      Buffer.isBuffer(obj) ||
      Array.isArray(obj) ||
      obj instanceof ArrayBuffer ||
      // ArrayLike<any>
      (null != obj &&
        "object" === typeof obj &&
        obj.hasOwnProperty("length") &&
        "number" === typeof obj.length &&
        (obj.length === 0 || (obj.length > 0 && obj.length - 1 in obj)))
    );
  }
}
