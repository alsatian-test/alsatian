import { EqType } from "./eq-type";
import { IContextualFluentMatcherCore } from "./i-contextual-fluent-matcher-core";

export interface IContextualFluentEntityMatcher<T, TParent> {
    equals(
        expected: T,
        eqType?: EqType
    ): IContextualFluentMatcherCore<T, TParent>;

    strictlyEquals(expected: T): IContextualFluentMatcherCore<T, TParent>;
    looselyEquals(expected: T): IContextualFluentMatcherCore<T, TParent>;
    deeplyEquals(
        expected: T,
        eqType: EqType.strictly | EqType.loosely
    ): IContextualFluentMatcherCore<T, TParent>;
    deepLooselyEquals(expected: T): IContextualFluentMatcherCore<T, TParent>;
    isDefined(): IContextualFluentMatcherCore<T, TParent>;
    matches(matcher: RegExp): IContextualFluentMatcherCore<string, TParent>;

    throws(): IContextualFluentMatcherCore<Error, TParent>;
    throws<TError extends Error>(errorType?: {
        new(...args: Array<any>): TError;
    }): IContextualFluentMatcherCore<TError, TParent>;
    throws<TError extends Error>(errorType?: {
        new(...args: Array<any>): TError;
    }): IContextualFluentMatcherCore<TError, TParent>;

    satisfies(
        predicate: (t: T) => boolean
    ): IContextualFluentMatcherCore<T, TParent>;

    isInstanceOf(expectedType: {
        new(): any;
    }): IContextualFluentMatcherCore<T, TParent>;

    has<R>(selector: (t: T) => R): IContextualFluentMatcherCore<R, T>;
}