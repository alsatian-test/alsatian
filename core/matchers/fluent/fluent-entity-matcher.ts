import deepEqual = require("deep-equal");

import { MatchError } from "../../alsatian-core";
import { FluentMatcherBase } from "./fluent-matcher-base";
import {
  FluentMatcherCore,
  NextFluentMatcherCore
} from "./fluent-matcher-core";
import { FluentPropertiesMatcher } from "./fluent-properties-matcher";
import { ErrorMatchError } from "../../errors";

export const enum EqType {
  deepStrictly = "deepStrictly",
  deepLoosely = "deepLoosely",
  loosely = "loosely",
  strictly = "strictly"
}

/** Fluent API for beginning entity (as opposed to property) assertion chains. */
export class FluentEntityMatcher<T, TParent> extends FluentMatcherBase<
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

  public equal(
    expected: T,
    eqType: EqType = EqType.strictly
  ): NextFluentMatcherCore<T, TParent> {
    switch (eqType) {
      case EqType.strictly:
        return this.strictlyEqual(expected);
      case EqType.loosely:
        return this.looselyEqual(expected);
      case EqType.deepLoosely:
        return this.deepLooselyEqual(expected);
      case EqType.deepStrictly:
        return this.deepStrictlyEqual(expected);
      default:
        throw new Error(`Unrecognized EqType: ${eqType}.`);
    }
  }

  public strictlyEqual(expected: T): NextFluentMatcherCore<T, TParent> {
    if (this.checkInvert(this.actualValue !== expected)) {
      throw new MatchError(
        "should strictly (===) equal",
        expected,
        this.actualValue
      );
    }
    return new NextFluentMatcherCore<T, TParent>(
      this.actualValue,
      this.parent,
      false
    );
  }

  public looselyEqual(expected: T): NextFluentMatcherCore<T, TParent> {
    /*tslint:disable:triple-equals*/
    if (this.checkInvert(this.actualValue != expected)) {
      /*tslint:enable:triple-equals*/
      throw new MatchError(
        "should loosely (==) equal",
        expected,
        this.actualValue
      );
    }
    return new NextFluentMatcherCore(this.actualValue, this.parent, false);
  }

  public deeplyEqual(
    expected: T,
    eqType: EqType.strictly | EqType.loosely
  ): NextFluentMatcherCore<T, TParent> {
    const equal = deepEqual(expected, this.actualValue, {
      strict: eqType === EqType.strictly
    });
    if (this.checkInvert(!equal)) {
      throw new MatchError(
        `should deeply equal (${eqType})`,
        expected,
        this.actualValue
      );
    }

    return new NextFluentMatcherCore(this.actualValue, this.parent, false);
  }

  public deepStrictlyEqual(expected: T): NextFluentMatcherCore<T, TParent> {
    return this.deeplyEqual(expected, EqType.strictly);
  }

  public deepLooselyEqual(expected: T): NextFluentMatcherCore<T, TParent> {
    return this.deeplyEqual(expected, EqType.loosely);
  }

  public beDefined(): NextFluentMatcherCore<T, TParent> {
    if (this.checkInvert(typeof this.actualValue === "undefined")) {
      throw new MatchError("should be defined.");
    }

    return new NextFluentMatcherCore(this.actualValue, this.parent, false);
  }

  public match(matcher: RegExp): NextFluentMatcherCore<string, TParent> {
    if (typeof this.actualValue !== "string") {
      throw new MatchError("actual value type was not a string");
    }

    if (this.checkInvert(!matcher.test(this.actualValue))) {
      throw new MatchError(
        "should match",
        matcher.toString(),
        this.actualValue
      );
    }

    return new NextFluentMatcherCore(this.actualValue, this.parent, false);
  }

  public throw(): NextFluentMatcherCore<Error, TParent>;
  public throw<TError extends Error>(errorType?: {
    new (...args: Array<any>): TError;
  }): FluentMatcherCore<TError, TParent>;
  public throw<TError extends Error>(errorType?: {
    new (...args: Array<any>): TError;
  }): FluentMatcherCore<TError, TParent> {
    let threw: boolean;
    let actualError: TError;
    try {
      this.actualValue();
      threw = false;
    } catch (err) {
      threw = true;
      actualError = err;
    }

    if (this.checkInvert(!threw)) {
      throw new ErrorMatchError(
        actualError,
        !this.invert,
        errorType,
        `should${this.negation}throw`
      );
    }

    if (typeof errorType !== "undefined") {
      if (this.checkInvert(!(actualError instanceof errorType))) {
        throw new ErrorMatchError(
          actualError,
          !this.invert,
          errorType,
          `should${this.negation}throw type`
        );
      }
    }

    return new NextFluentMatcherCore(actualError, this.parent, this.invert);
  }

  public satisfy(
    predicate: (t: T) => boolean
  ): NextFluentMatcherCore<T, TParent> {
    if (this.checkInvert(!predicate(this.actualValue))) {
      throw new MatchError(
        "should match lambda",
        this.getFnString(predicate),
        this.actualValue
      );
    }

    return new NextFluentMatcherCore(this.actualValue, this.parent, false);
  }

  public beInstanceOf(expectedType: {
    new (): any;
  }): NextFluentMatcherCore<T, TParent> {
    if (this.checkInvert(!(this.actualValue instanceof expectedType))) {
      throw new MatchError(
        "should match type",
        typeof this.actualValue,
        typeof expectedType
      );
    }

    return new NextFluentMatcherCore(this.actualValue, this.parent, false);
  }
}