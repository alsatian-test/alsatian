import { FluentMatcherNext } from "./fluent-matcher-next";
import { MatchError } from "../../alsatian-core";
import { FluentMatcherCore } from "./fluent-matcher-core";
import { FluentMatcherBase } from "./fluent-matcher-base";

export type AllPropertyAssertsDict<T> = {
  [key in keyof T]:
    | T[key]
    | ((actual: T[key]) => boolean | void | FluentMatcherNext<any>)
};
export type SubsetPropertyAssertsDict<T> = {
  [key in keyof T]?: AllPropertyAssertsDict<T>[key]
};

export class FluentPropertiesMatcher<T> extends FluentMatcherBase<T> {
  constructor(
    protected actualValue: any,
    protected parent: FluentMatcherCore<T>,
    protected invert: boolean
  ) {
    super(actualValue, parent, invert);
  }

  public properties(
    subsetDict: SubsetPropertyAssertsDict<T>
  ): FluentMatcherNext<T> {
    if (typeof this.actualValue === "undefined") {
      throw new MatchError("should be defined.");
    }

    for (const k in subsetDict) {
      if (!subsetDict.hasOwnProperty(k)) {
        continue;
      }
      const expected = subsetDict[k];
      const actual = this.actualValue[k];
      if (expected instanceof Function) {
        expected(actual);
      } else {
        if (expected !== actual) {
          throw new MatchError(
            `property ${k} should have matching value`,
            expected,
            actual
          );
        }
      }
    }

    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  /**
   * Ensures compile-time errors when properties are missing from the expected value definition.
   * This helps you remember to update your tests when adding properties to your types, in the future.
   * @param dict A dictionary with all properties of T.
   */
  public allProperties(dict: AllPropertyAssertsDict<T>): FluentMatcherNext<T> {
    return this.properties(dict);
  }

  public keys<K extends keyof T>(expectedKeys: Array<K>): FluentMatcherNext<T> {
    if (!expectedKeys.every(k => typeof this.actualValue[k] !== "undefined")) {
      throw new MatchError(
        "does not contain all",
        expectedKeys,
        this.actualValue
      );
    }

    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  public elements(expected: Array<any>): FluentMatcherNext<T> {
    if (!(this.actualValue instanceof Array)) {
      throw new MatchError("not an array type", expected, this.actualValue);
    }

    return new FluentMatcherNext(this.actualValue, this);
  }

  public all(predicate: (t: T) => boolean): FluentMatcherNext<T> {
    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  public get and(): FluentPropertiesMatcher<T> {
    return this;
  }
}
