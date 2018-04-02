import { EqType } from "./eq-type";
import { IFluentMatcherCore } from "./i-fluent-matcher-core";
import { IContextualFluentMatcherCore } from "./i-contextual-fluent-matcher-core";

/** Fluent API for beginning entity (as opposed to property) assertion chains. */
export interface IFluentEntityMatcher<T, TParent> {
  /**
   * Compares the contextual value with expected value.
   * @param expected The expected value.
   * @param eqType The comparison type (default: EqType.strictly, ===).
   */
  equal(expected: T, eqType?: EqType): IFluentMatcherCore<T, TParent>;

  /**
   * Strictly (===) compares the contextual value with the expected value.
   * Helper method for equal(...).
   * @param expected The expected value.
   */
  strictlyEqual(expected: T): IFluentMatcherCore<T, TParent>;

  /**
   * Loosely (==) compares the contextual value with the expected value.
   * @param expected The expected value.
   */
  looselyEqual(expected: T): IFluentMatcherCore<T, TParent>;

  /**
   * Recursively compares the contextual value with the expected value.
   * @param expected The expected value.
   * @param eqType The comparison type, either EqType.strictly or EqType.loosely (default: strictly).
   */
  deeplyEqual(
    expected: T,
    eqType?: EqType.strictly | EqType.loosely
  ): IFluentMatcherCore<T, TParent>;

  /**
   * Performs a loose, recursive comparison of the contextual value with the expected value.
   * @param expected The expected value.
   */
  deepLooselyEqual(expected: T): IFluentMatcherCore<T, TParent>;

  /**
   * Performs a strict, recursive comparison of the contextual value with the expected value.
   * @param expected The expected value.
   */
  deepStrictlyEqual(expected: T): IFluentMatcherCore<T, TParent>;

  /**
   * Checks whether the value is defined.
   */
  beDefined(): IFluentMatcherCore<T, TParent>;

  /**
   * Validates the contextual, string value with a regular expression.
   * @param matcher The regular expression to validate the contextual value.
   */
  match(matcher: RegExp): IFluentMatcherCore<string, TParent>;

  /**
   * Same as matches, except that it narrows the context to the matches themselves.
   * @param matcher The regular expression to match the contextual value.
   * @returns A fluent context for the matches, themselves.
   */
  haveMatches(
    matcher: RegExp
  ): IContextualFluentMatcherCore<Array<string>, TParent>;

  /**
   * Validates whether the contextual value (a lambda function) throws an Error.
   * Narrows the fluent context to the error object.
   */
  throw(): IContextualFluentMatcherCore<Error, TParent>;

  /**
   * Validates whether the contextual value (a lambda function) throws an Error of the given type.
   * Narrows the fluent context to the error object.
   * @param errorType The type of the Error.
   * @returns A fluent context for the error object.
   */
  throw<TError extends Error>(errorType?: {
    new (...args: Array<any>): TError;
  }): IContextualFluentMatcherCore<TError, TParent>;

  /**
   * Checks whether the contextual value satisfies the given predicate function.
   * @param predicate A function returning a boolean value.
   */
  satisfy(predicate: (t: T) => boolean): IFluentMatcherCore<T, TParent>;

  /**
   * Checks whether the contextual value is an instance of the given type.
   * @param expectedType The expected type.
   */
  beInstanceOf<TClass>(expectedType: {
    new (...args: Array<any>): TClass;
  }): IFluentMatcherCore<T, TParent>;

  /**
   * Checks whether the contextual value has the given property, and narrows
   * the fluent context to the value of that property.
   * @param selector A property selector function.
   * @returns A fluent context for the selected property.
   */
  have<R>(selector: (t: T) => R): IContextualFluentMatcherCore<R, T>;
}
