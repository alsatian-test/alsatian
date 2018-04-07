import { MatchError } from "../../alsatian-core";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { FluentMatcherCore } from "./fluent-matcher-core";
import { FluentEntityMatcher } from "./fluent-entity-matcher";
import { IContextualFluentEntityMatcher } from "./i-contextual-fluent-entity-matcher";
import { IFluentEntityMatcher } from "./i-fluent-entity-matcher";
import { IFluentPropertiesMatcher } from "./i-fluent-properties-matcher";
import { IFluentMatcherCore } from "./i-fluent-matcher-core";
import { IContextualFluentMatcherCore } from "./i-contextual-fluent-matcher-core";
import { PropertiesMatchError } from "../../errors/properties-match-error";
import { NestedPropertiesMatchError } from "../../errors/nested-properties-match-error";

/** Affords type safety when creating property lambdas. */
export type FluentMatcherSafeStop =
  | IFluentMatcherCore<any, any>
  | IContextualFluentMatcherCore<any, any>;
export type PropLambdaUnderstoodReturns =
  | boolean
  | void
  | FluentMatcherSafeStop;

/** Lambda type for asserting property values. */
export type PropertyLambda<TProp> = (
  actual?: TProp
) => PropLambdaUnderstoodReturns;

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

/** @inheritDoc */
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

  /** @inheritDoc */
  public properties(
    subsetDict: SubsetPropertyAssertsDict<T>
  ): FluentMatcherCore<T, TParent> {
    this._properties(this.actualValue, subsetDict, []);
    return new FluentMatcherCore(this.actualValue, this.parent, false);
  }

  /** @inheritDoc */
  public allProperties(
    dict: AllPropertyAssertsDict<T>
  ): FluentMatcherCore<T, TParent> {
    this._properties(this.actualValue, dict, []);
    return new FluentMatcherCore(this.actualValue, this.parent, false);
  }

  /** @inheritDoc */
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

  /** @inheritDoc */
  public elements(expected: Array<any>): FluentMatcherCore<T, TParent> {
    if (!(this.actualValue instanceof Array)) {
      throw new MatchError("not an array type", expected, this.actualValue);
    }

    if (!expected.every(e => this.actualValue.indexOf(e) > -1)) {
      throw new MatchError("does not contain all", expected, this.actualValue);
    }

    return new FluentMatcherCore(this.actualValue as any, this.parent, false);
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

  protected _properties(
    actualObject: any,
    expectedObject: any,
    path: Array<string>
  ): void {
    this.assertNestedPropertiesDefined(actualObject, expectedObject, path);
    const keys = Object.keys(expectedObject);
    /*tslint:disable:forin*/
    for (const i in keys) {
      /*tslint:enable:forin*/
      const k: keyof T = keys[i] as any;
      const curPath = path.slice(0); // clone
      curPath.push(k);
      const expected = expectedObject[k];
      const actual = actualObject[k];
      this.assertPropertyByType(k, actual, expected, curPath);
    }
  }

  protected assertNestedPropertiesDefined(
    actualObject: any,
    expectedObject: any,
    path: Array<string>
  ) {
    if (typeof actualObject === "undefined" || actualObject === null) {
      if (path.length > 0) {
        throw new MatchError(
          `property '${
            path[path.length - 1]
          }' should be defined at path '${this.formatKeyPath(path)}'`
        );
      } else {
        throw new MatchError("should be defined.");
      }
    }
  }

  protected assertPropertyByType(
    k: any,
    actual: any,
    expected: any,
    curPath: Array<string>
  ) {
    if (typeof expected === "function") {
      this.assertFnProperty(
        k,
        expected as PropertyLambda<T[keyof T]>,
        actual,
        curPath
      );
    } else if (expected instanceof RegExp) {
      this.assertRegExpProperty(k, expected, actual, curPath);
    } else if (
      typeof expected === "object" &&
      Object.keys(expected as any).length > 0
    ) {
      this._properties(actual, expected, curPath);
    } else if (this.checkInvert(expected !== actual)) {
      throw new MatchError(
        `property ${k} at path '${this.formatKeyPath(curPath)}' should${
          this.negation
        }equal`,
        expected,
        actual
      );
    }
  }

  protected formatKeyPath(path: Array<string>): string {
    path.unshift("$");
    return path.join(".");
  }

  /**
   * A properties assertion function can fail by falsy return value, or by
   * throwing an error (perhaps from nested assertions).
   */
  protected assertFnProperty<TKey extends keyof T>(
    key: TKey,
    assertion: PropertyLambda<T[TKey]>,
    actual: T[TKey],
    path: Array<string>
  ): void {
    let check = null;
    try {
      check = assertion(actual);
    } catch (err) {
      this.failFnError(err, path);
    }

    this.assertFnBoolean(check, assertion, actual, path);
  }

  protected failFnError(err: Error, path: Array<string>) {
    if (err instanceof MatchError) {
      throw new NestedPropertiesMatchError(
        "failed nested expectation",
        this.formatKeyPath(path),
        err
      );
    } else {
      throw new NestedPropertiesMatchError(
        "threw unexpected error",
        this.formatKeyPath(path),
        err
      );
    }
  }

  protected assertFnBoolean<TKey extends keyof T>(
    check: any,
    assertion: PropertyLambda<T[TKey]>,
    actual: T[TKey],
    path: Array<string>
  ) {
    if (typeof check === "boolean" && this.checkInvert(!check)) {
      throw new PropertiesMatchError(
        `failed ${this.invert ? "(inverted) " : " "}boolean lambda assertion`,
        this.formatKeyPath(path),
        this.getFnString(assertion),
        actual
      );
    } else if (this.invert) {
      throw new PropertiesMatchError(
        "expected lambda to return false, or yield a failed nested expectation or error",
        this.formatKeyPath(path),
        this.getFnString(assertion),
        actual
      );
    }
  }

  protected assertRegExpProperty<TProp>(
    key: keyof T,
    regexp: RegExp,
    actual: TProp,
    path: Array<string>
  ): void {
    const kpath: string = this.formatKeyPath(path);
    if (actual instanceof RegExp) {
      if (this.checkInvert(actual.toString() !== regexp.toString())) {
        throw new MatchError(
          `regular expressions at path '${kpath}' should${this.negation}match`,
          regexp,
          actual
        );
      }
    } else if (typeof actual !== "string") {
      throw new MatchError(
        `expected type 'string' for regexp match at path '${kpath}'`,
        "string",
        typeof actual
      );
    } else if (this.checkInvert(!regexp.test(actual))) {
      throw new MatchError(
        `regular expression at path '${kpath}' should${this.negation}match`,
        regexp.toString(),
        actual
      );
    }
  }
}
