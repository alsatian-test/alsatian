import { MatchError } from "../../alsatian-core";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { FluentMatcherCore } from "./fluent-matcher-core";
import { FluentEntityMatcher } from "./fluent-entity-matcher";

/** Affords type safety when creating property lambdas. */
export type FluentMatcherNext = FluentMatcherCore<any, any>;

/** Lambda type for asserting property values. */
export type PropertyLambda<TProp> = (
  actual?: TProp
) => boolean | void | FluentMatcherNext;

/** Dictionary type for asserting over all (strictly) values within an object. */
export type AllPropertyAssertsDict<T> = {
  [key in keyof T]:
    | T[key]
    | PropertyLambda<T[key]>
    | RegExp
    | AllPropertyAssertsDict<T[key]>
};

/** Dictionary type for asserting over some values within an object. */
export type SubsetPropertyAssertsDict<T> = {
  [key in keyof T]?:
    | T[key]
    | PropertyLambda<T[key]>
    | RegExp
    | SubsetPropertyAssertsDict<T[key]>
};

/**
 * Fluent API for beginning property assertions on complex types (e.g., objects or arrays).
 */
export class FluentPropertiesMatcher<T, TParent> extends FluentMatcherBase<
  T,
  TParent
> {
  constructor(
    protected actualValue: any,
    protected parent: TParent,
    protected invert: boolean
  ) {
    super(actualValue, parent, invert);
  }

  /**
   * Ensures the expected object contains the provided subset of property definitions. See https://git.io/vAH9p
   * @param subsetDict A subset of the original object's properties, with values replaced with assertions.
   */
  public properties(
    subsetDict: SubsetPropertyAssertsDict<T>
  ): FluentMatcherCore<T, TParent> {
    this._properties(this.actualValue, subsetDict, []);
    return new FluentMatcherCore(this.actualValue, this.parent, false);
  }

  /**
   * Like properties(...) but ensures compile-time errors when properties are missing from the expected
   * value definition. This helps you remember to update your tests when adding properties to your types,
   * in the future. See https://git.io/vAHHs
   * @param dict A dictionary with all properties of T.
   */
  public allProperties(
    dict: AllPropertyAssertsDict<T>
  ): FluentMatcherCore<T, TParent> {
    this._properties(this.actualValue, dict, []);
    return new FluentMatcherCore(this.actualValue, this.parent, false);
  }

  /**
   * Checks for the existence of keys on the expected object, without regard for values.
   * @param expectedKeys An array of keys to existence-check.
   */
  public keys<K extends keyof T>(
    expectedKeys: Array<K>
  ): FluentMatcherCore<T, TParent> {
    if (!this.actualValue) {
      throw new MatchError("should be defined.");
    }

    if (!expectedKeys.every(k => typeof this.actualValue[k] !== "undefined")) {
      throw new MatchError(
        "does not contain all",
        expectedKeys,
        this.actualValue
      );
    }

    return new FluentMatcherCore(this.actualValue, this.parent, false);
  }

  /**
   * Checks an array for the given values.
   * @param expected The values to existence-check within the expected array.
   */
  public elements(expected: Array<any>): FluentMatcherCore<T, TParent> {
    if (!(this.actualValue instanceof Array)) {
      throw new MatchError("not an array type", expected, this.actualValue);
    }

    if (!expected.every(e => this.actualValue.indexOf(e) > -1)) {
      throw new MatchError("does not contain all", expected, this.actualValue);
    }

    return new FluentMatcherCore(
      this.actualValue as any,
      this.parent,
      false
    );
  }

  /*  public allPairs<K extends keyof T>(
    predicate: (k: K, v: T[K], i?: number) => boolean
  ): FluentPropertiesMatcherNext<T, TParent> {
    return new FluentPropertiesMatcherNext(this.actualValue, this.parent);
  }

  public all<T2 extends Array<any>>(
    predicate: (el: T2, i?: number) => boolean
  ): FluentPropertiesMatcherNext<T, TParent> {
    return new FluentPropertiesMatcherNext(this.actualValue, this.parent);
  }

  public anyPairs<K extends keyof T>(
    predicate: (k: K, v: T[K], i?: number) => boolean
  ): FluentPropertiesMatcherNext<T, TParent> {
    return new FluentPropertiesMatcherNext(this.actualValue, this.parent);
  }

  public any(
    predicate: (t: T) => boolean
  ): FluentPropertiesMatcherNext<T, TParent> {
    return new FluentPropertiesMatcherNext(this.actualValue, this.parent);
  } */

  protected _properties(actualObject: any, expectedObject: any, path: string[]): void {
    if (typeof actualObject === "undefined" || actualObject === null) {
      if (path.length > 0) {
        throw new MatchError(`property '${path[path.length - 1]}' should be defined at path '${this.formatKeyPath(path)}'`);
      } else {
        throw new MatchError("should be defined.");
      }
    }

    const keys = Object.keys(expectedObject);
    /*tslint:disable:forin*/
    for (const i in keys) {
      /*tslint:enable:forin*/
      const k: keyof T = keys[i] as any;
      var curPath = path.slice(0);
      curPath.push(k);
      const expected = expectedObject[k];
      const actual = actualObject[k];
      if (typeof expected === "function") {
        this.assertProperty(k, expected as PropertyLambda<T[any]>, actual, curPath);
      } else if (expected instanceof RegExp) {
        this.assertRegExp(k, expected, actual, curPath);
      } else if (typeof expected === "object" && Object.keys(<any>expected).length) {
        this._properties(actual, expected, curPath);
      } else if (this.checkInvert(expected !== actual)) {
        throw new MatchError(
          `property ${k} at path '${this.formatKeyPath(curPath)}' should${this.negation}equal`,
          expected,
          actual
        );
      }
    }
  }

  protected formatKeyPath(path: string[]): string {
    path.unshift("$");
    return path.join(".");
  }

  protected assertProperty<TKey extends keyof T>(
    key: TKey,
    assertion: PropertyLambda<T[TKey]>,
    actual: T[TKey],
    path: string[]
  ): void {
    const check = assertion(actual);
    if (typeof check === "boolean" && this.checkInvert(!check)) {
      throw new MatchError(
        `value at '${key}', path '${this.formatKeyPath(path)}', failed lambda assertion`,
        this.getFnString(assertion),
        actual
      );
    }
  }

  protected assertRegExp<TProp>(
    key: keyof T,
    regexp: RegExp,
    actual: TProp,
    path: string[]
  ): void {
    if (actual instanceof RegExp) {
      if (this.checkInvert(actual.toString() !== regexp.toString())) {
        throw new MatchError(
          `regular expressions at path '${this.formatKeyPath(path)}' should${this.negation}match`,
          regexp,
          actual
        );
      }
    } else if (typeof actual !== "string") {
      throw new MatchError(
        `expected type 'string' for regexp match at path '${this.formatKeyPath(path)}'`,
        "string",
        typeof actual
      );
    } else if (this.checkInvert(!regexp.test(actual))) {
      throw new MatchError(
        `regular expression at path '${this.formatKeyPath(path)}' should${this.negation}match`,
        regexp.toString(),
        actual
      );
    }
  }
}
