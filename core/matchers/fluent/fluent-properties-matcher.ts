import { MatchError } from "../../alsatian-core";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { NextFluentMatcherCore } from ".";

/** Affords type safety when creating property lambdas. */
export type FluentMatcherNext = NextFluentMatcherCore<any, any>;

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
  ): NextFluentMatcherCore<T, TParent> {
    if (typeof this.actualValue === "undefined" || this.actualValue === null) {
      throw new MatchError("should be defined.");
    }

    const keys = Object.keys(subsetDict);
    /*tslint:disable:forin*/
    for (const i in keys) {
      /*tslint:enable:forin*/
      const k: keyof T = keys[i] as any;
      const expected = subsetDict[k];
      const actual = this.actualValue[k];
      if (typeof expected === "function") {
        this.assertProperty(k, expected as PropertyLambda<T[any]>, actual);
      } else if (expected instanceof RegExp) {
        this.assertRegExp(k, expected, actual);
      } else if (this.checkInvert(expected !== actual)) {
        throw new MatchError(
          `property ${k} should${this.negation}have matching value`,
          expected,
          actual
        );
      }
    }

    return new NextFluentMatcherCore(this.actualValue, this.parent, false);
  }

  /**
   * Like properties(...) but ensures compile-time errors when properties are missing from the expected
   * value definition. This helps you remember to update your tests when adding properties to your types,
   * in the future. See https://git.io/vAHHs
   * @param dict A dictionary with all properties of T.
   */
  public allProperties(
    dict: AllPropertyAssertsDict<T>
  ): NextFluentMatcherCore<T, TParent> {
    return this.properties(dict);
  }

  /**
   * Checks for the existence of keys on the expected object, without regard for values.
   * @param expectedKeys An array of keys to existence-check.
   */
  public keys<K extends keyof T>(
    expectedKeys: Array<K>
  ): NextFluentMatcherCore<T, TParent> {
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

    return new NextFluentMatcherCore(this.actualValue, this.parent, false);
  }

  /**
   * Checks an array for the given values.
   * @param expected The values to existence-check within the expected array.
   */
  public elements(expected: Array<any>): NextFluentMatcherCore<T, TParent> {
    if (!(this.actualValue instanceof Array)) {
      throw new MatchError("not an array type", expected, this.actualValue);
    }

    if (!expected.every(e => this.actualValue.indexOf(e) > -1)) {
      throw new MatchError("does not contain all", expected, this.actualValue);
    }

    return new NextFluentMatcherCore(
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

  protected assertProperty<TKey extends keyof T>(
    key: TKey,
    assertion: PropertyLambda<T[TKey]>,
    actual: T[TKey]
  ): void {
    const check = assertion(actual);
    if (typeof check === "boolean" && this.checkInvert(!check)) {
      throw new MatchError(
        `value of dictionary property '${key}' failed lambda assertion`,
        this.getFnString(assertion),
        actual
      );
    }
  }

  protected assertRegExp<TProp>(
    key: keyof T,
    regexp: RegExp,
    actual: TProp
  ): void {
    if (actual instanceof RegExp) {
      if (this.checkInvert(actual.toString() !== regexp.toString())) {
        throw new MatchError(
          `regular expressions should${this.negation}match`,
          regexp,
          actual
        );
      }
    } else if (typeof actual !== "string") {
      throw new MatchError(
        "expected type 'string' for regexp match",
        "string",
        typeof actual
      );
    } else if (this.checkInvert(!regexp.test(actual))) {
      throw new MatchError(
        `regular expression should${this.negation}match`,
        regexp.toString(),
        actual
      );
    }
  }
}
