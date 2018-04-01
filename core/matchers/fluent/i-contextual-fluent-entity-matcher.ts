import { EqType } from "./eq-type";
import { IContextualFluentMatcherCore } from "./i-contextual-fluent-matcher-core";

/** Fluent API for contextual entity (as opposed to property) assertion chains. */
export interface IContextualFluentEntityMatcher<T, TParent> {
    /**
     * Compares the contextual value with expected value.
     * @param expected The expected value.
     * @param eqType The comparison type (default: EqType.strictly, ===).
     */
    equals(
        expected: T,
        eqType?: EqType
    ): IContextualFluentMatcherCore<T, TParent>;

    /**
     * Strictly (===) compares the contextual value with the expected value.
     * Helper method for equal(...).
     * @param expected The expected value.
     */
    strictlyEquals(expected: T): IContextualFluentMatcherCore<T, TParent>;

    /**
     * Loosely (==) compares the contextual value with the expected value.
     * @param expected The expected value.
     */
    looselyEquals(expected: T): IContextualFluentMatcherCore<T, TParent>;

    /**
     * Recursively compares the contextual value with the expected value.
     * @param expected The expected value.
     * @param eqType The comparison type, either EqType.strictly or EqType.loosely (default: strictly).
     */
    deeplyEquals(
        expected: T,
        eqType: EqType.strictly | EqType.loosely
    ): IContextualFluentMatcherCore<T, TParent>;

    /**
     * Performs a loose, recursive comparison of the contextual value with the expected value.
     * @param expected The expected value.
     */
    deepLooselyEquals(expected: T): IContextualFluentMatcherCore<T, TParent>;

    /**
     * Performs a strict, recursive comparison of the contextual value with the expected value.
     * @param expected The expected value.
     */
    deepStrictlyEquals(expected: T): IContextualFluentMatcherCore<T, TParent>;

    /**
     * Checks whether the value is defined.
     */    
    isDefined(): IContextualFluentMatcherCore<T, TParent>;

    /**
     * Validates the contextual, string value with a regular expression. Preserves context.
     * @param matcher The regular expression to validate the contextual value.
     */    
    matches(matcher: RegExp): IContextualFluentMatcherCore<string, TParent>;

    /**
     * Same as matches, except that it narrows the context to the matches themselves.
     * @param matcher The regular expression to match the contextual value.
     */
    hasMatches(matcher: RegExp): IContextualFluentMatcherCore<string[], TParent>

    /**
     * Validates whether the contextual value (a lambda function) throws an Error.
     * Narrows the fluent context to the error object.
     */
    throws(): IContextualFluentMatcherCore<Error, TParent>;

    /**
     * Validates whether the contextual value (a lambda function) throws an Error of the given type.
     * Narrows the fluent context to the error object.
     * @param errorType The type of the Error.
     * @returns A fluent context for the error object.
     */
    throws<TError extends Error>(errorType?: {
        new(...args: Array<any>): TError;
    }): IContextualFluentMatcherCore<TError, TParent>;

    /**
     * Checks whether the contextual value satisfies the given predicate function.
     * @param predicate A function returning a boolean value.
     */
    satisfies(
        predicate: (t: T) => boolean
    ): IContextualFluentMatcherCore<T, TParent>;

    /**
     * Checks whether the contextual value is an instance of the given type.
     * @param expectedType The expected type.
     */
    isInstanceOf(expectedType: {
        new(): any;
    }): IContextualFluentMatcherCore<T, TParent>;

    /**
     * Checks whether the contextual value has the given property, and narrows
     * the fluent context to the value of that property.
     * @param selector A property selector function.
     * @returns A fluent context for the selected property.
     */
    has<R>(selector: (t: T) => R): IContextualFluentMatcherCore<R, T>;
}