import deepEqual = require("deep-equal");

import { MatchError, FluentExpect } from "../../alsatian-core";
import { FluentMatcherBase } from "./fluent-matcher-base";
import { FluentMatcherCore } from "./fluent-matcher-core";
import { FluentPropertiesMatcher } from "./fluent-properties-matcher";
import { ErrorMatchError } from "../../errors";
import { IFluentEntityMatcher } from "./i-fluent-entity-matcher";
import { IContextualFluentEntityMatcher } from "./i-contextual-fluent-entity-matcher";
import { EqType } from "./eq-type";
import { IFluentMatcherCore } from "./i-fluent-matcher-core";
import { IContextualFluentMatcherCore } from "./i-contextual-fluent-matcher-core";

/** @inheritDoc */
export class FluentEntityMatcher<T, TParent>
  extends FluentMatcherBase<T, TParent>
  implements IFluentEntityMatcher<T, TParent>,IContextualFluentEntityMatcher<T, TParent>
{
    constructor(
        protected actualValue: any,
        protected parent: TParent,
        protected invert: boolean
    ) {
        super(actualValue, parent, invert);
    }

    /** @inheritDoc */
    public equal(
        expected: T,
        eqType: EqType = EqType.strictly
    ): FluentMatcherCore<T, TParent> {
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
    /** @inheritDoc */
    public equals = this.equal;

    /** @inheritDoc */
    public strictlyEqual(expected: T): FluentMatcherCore<T, TParent> {
        if (this.checkInvert(this.actualValue !== expected)) {
            throw new MatchError(
                "should strictly (===) equal",
                expected,
                this.actualValue
            );
        }
        return new FluentMatcherCore<T, TParent>(
            this.actualValue,
            this.parent,
            false
        );
    }
    /** @inheritDoc */
    public strictlyEquals = this.strictlyEqual;

    /** @inheritDoc */
    public looselyEqual(expected: T): FluentMatcherCore<T, TParent> {
        /*tslint:disable:triple-equals*/
        if (this.checkInvert(this.actualValue != expected)) {
            /*tslint:enable:triple-equals*/
            throw new MatchError(
                "should loosely (==) equal",
                expected,
                this.actualValue
            );
        }
        return new FluentMatcherCore(this.actualValue, this.parent, false);
    }
    /** @inheritDoc */
    public looselyEquals = this.looselyEqual;

    /** @inheritDoc */
    public deeplyEqual(
        expected: T,
        eqType: EqType.strictly | EqType.loosely = EqType.strictly
    ): FluentMatcherCore<T, TParent> {
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

        return new FluentMatcherCore(this.actualValue, this.parent, false);
    }
    /** @inheritDoc */
    public deeplyEquals = this.deeplyEqual;

    /** @inheritDoc */
    public deepStrictlyEqual(expected: T): FluentMatcherCore<T, TParent> {
        return this.deeplyEqual(expected, EqType.strictly);
    }
    /** @inheritDoc */
    public deepStrictlyEquals = this.deepStrictlyEqual;

    /** @inheritDoc */
    public deepLooselyEqual(expected: T): FluentMatcherCore<T, TParent> {
        return this.deeplyEqual(expected, EqType.loosely);
    }
    /** @inheritDoc */
    public deepLooselyEquals = this.deepLooselyEqual;

    /** @inheritDoc */
    public beDefined(): FluentMatcherCore<T, TParent> {
        if (this.checkInvert(typeof this.actualValue === "undefined")) {
            throw new MatchError(`should${this.negation}be defined.`);
        }

        return new FluentMatcherCore(this.actualValue, this.parent, false);
    }
    /** @inheritDoc */
    public isDefined = this.beDefined;

    /** @inheritDoc */
    public match(matcher: RegExp): FluentMatcherCore<string, TParent> {
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

        return new FluentMatcherCore(this.actualValue, this.parent, false);
    }
    /** @inheritDoc */
    public matches = this.match;

    /** @inheritDoc */
    public throw(): FluentMatcherCore<Error, TParent>;
    /** @inheritDoc */
    public throw<TError extends Error>(errorType?: {
        new(...args: Array<any>): TError;
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

        return new FluentMatcherCore(actualError, this.parent, this.invert);
    }
    /** @inheritDoc */
    public throws = this.throw;

    /** @inheritDoc */
    public satisfy(
        predicate: (t: T) => boolean
    ): FluentMatcherCore<T, TParent> {
        if (this.checkInvert(!predicate(this.actualValue))) {
            throw new MatchError(
                "should match lambda",
                this.getFnString(predicate),
                this.actualValue
            );
        }

        return new FluentMatcherCore(this.actualValue, this.parent, false);
    }
    /** @inheritDoc */
    public satisfies = this.satisfy;

    /** @inheritDoc */
    public beInstanceOf(expectedType: {
        new(): any;
    }): FluentMatcherCore<T, TParent> {
        if (this.checkInvert(!(this.actualValue instanceof expectedType))) {
            throw new MatchError(
                "should match type",
                typeof this.actualValue,
                typeof expectedType
            );
        }

        return new FluentMatcherCore(this.actualValue, this.parent, false);
    }
    /** @inheritDoc */
    public isInstanceOf = this.beInstanceOf;

    /** @inheritDoc */
    public have<R>(selector: (t: T) => R): FluentMatcherCore<R, T> {
        if (! (selector instanceof Function)) {
            throw new Error("Provided selector was not a function.");
        }

        let selected = selector(this.actualValue);

        if (this.checkInvert(typeof selected === "undefined")) {
            throw new MatchError(
                "should be defined",
                this.getFnString(selector),
                this.actualValue
            );
        }

        return new FluentMatcherCore(selected, this.actualValue, false);
    }
    /** @inheritDoc */
    public has = this.have;
}