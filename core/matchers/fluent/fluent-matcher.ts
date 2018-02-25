import deepEqual = require("deep-equal");

import { FluentMatcherNext } from "./fluent-matcher-next";
import { MatchError } from "../../alsatian-core";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { FluentMatcherCore } from "./fluent-matcher-core";
import { exec } from "child_process";

export const enum EqType {
  deepStrictly = "deepStrictly",
  deepLoosely = "deepLoosely",
  loosely = "loosely",
  strictly = "strictly"
}

export class FluentMatcher<T> extends FluentMatcherBase<T> {
  constructor(
    protected actualValue: any,
    protected parent: FluentMatcherCore<T>,
    protected invert: boolean
  ) {
    super(actualValue, parent, invert);
  }

  public get and(): FluentMatcher<T> {
    return this;
  }

  public equal(
    expected: T,
    eqType: EqType = EqType.strictly
  ): FluentMatcherNext<T> {
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

  public strictlyEqual(expected: T): FluentMatcherNext<T> {
    if (this.checkInvert(this.actualValue !== expected)) {
      throw new MatchError(
        "should strictly (===) equal",
        expected,
        this.actualValue
      );
    }
    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  public looselyEqual(expected: T): FluentMatcherNext<T> {
    /*tslint:disable:triple-equals*/
    if (this.checkInvert(this.actualValue != expected)) {
      /*tslint:enable:triple-equals*/
      throw new MatchError(
        "should loosely (==) equal",
        expected,
        this.actualValue
      );
    }
    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  public deeplyEqual(
    expected: T,
    eqType: EqType.strictly | EqType.loosely
  ): FluentMatcherNext<T> {
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

    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  public deepStrictlyEqual(expected: T): FluentMatcherNext<T> {
    return this.deeplyEqual(expected, EqType.strictly);
  }

  public deepLooselyEqual(expected: T): FluentMatcherNext<T> {
    return this.deeplyEqual(expected, EqType.loosely);
  }

  public beDefined(): FluentMatcherNext<T> {
    if (this.checkInvert(typeof this.actualValue === "undefined")) {
      throw new MatchError("should be defined.");
    }

    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  public match(matcher: RegExp): FluentMatcherNext<T> {
    if (this.checkInvert(!matcher.test(this.actualValue))) {
      throw new MatchError(
        "should match",
        matcher.toString(),
        this.actualValue
      );
    }

    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  public throw(): FluentMatcherNext<T> {
    let threw: boolean;
    try {
      this.actualValue();
      threw = false;
    } catch (err) {
      threw = true;
    }

    if (this.checkInvert(!threw)) {
      throw new MatchError(`should${this.negation}throw`);
    }

    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  public satisfy(predicate: (t: T) => boolean): FluentMatcherNext<T> {
    if (this.checkInvert(!predicate(this.actualValue))) {
      throw new MatchError(
        "should match lambda",
        this.getFnString(predicate),
        this.actualValue
      );
    }

    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  public beInstanceOf(expectedType: { new (): any }): FluentMatcherNext<T> {
    if (this.checkInvert(!(this.actualValue instanceof expectedType))) {
      throw new MatchError(
        "should match type",
        typeof this.actualValue,
        typeof expectedType
      );
    }

    return new FluentMatcherNext<T>(this.actualValue, this);
  }

  protected getFnString(fn: (...args: Array<any>) => any): string {
    const mAlias = fn.toString();
    return mAlias.substr(Math.max(mAlias.length, 500 /* fns can get long */));
  }
}
