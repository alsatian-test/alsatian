import { EqType } from "./eq-type";
import { IFluentMatcherCore } from "./i-fluent-matcher-core";

export interface IFluentEntityMatcher<T, TParent> {
    equal(
        expected: T,
        eqType?: EqType
    ): IFluentMatcherCore<T, TParent>;

    strictlyEqual(expected: T): IFluentMatcherCore<T, TParent>;
    looselyEqual(expected: T): IFluentMatcherCore<T, TParent>;
    deeplyEqual(
        expected: T,
        eqType: EqType.strictly | EqType.loosely
    ): IFluentMatcherCore<T, TParent>;
    deepLooselyEqual(expected: T): IFluentMatcherCore<T, TParent>;
    beDefined(): IFluentMatcherCore<T, TParent>;
    match(matcher: RegExp): IFluentMatcherCore<string, TParent>;

    throw(): IFluentMatcherCore<Error, TParent>;
    throw<TError extends Error>(errorType?: {
        new(...args: Array<any>): TError;
    }): IFluentMatcherCore<TError, TParent>;
    throw<TError extends Error>(errorType?: {
        new(...args: Array<any>): TError;
    }): IFluentMatcherCore<TError, TParent>;

    satisfy(
        predicate: (t: T) => boolean
    ): IFluentMatcherCore<T, TParent>;

    beInstanceOf(expectedType: {
        new(): any;
    }): IFluentMatcherCore<T, TParent>;

    have<R>(selector: (t: T) => R): IFluentMatcherCore<R, T>;
}