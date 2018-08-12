import {
  ContainerMatcher,
  EmptyMatcher,
  FunctionMatcher,
  Matcher,
  NumberMatcher,
  PropertyMatcher,
  StringMatcher
} from "../matchers";
import { FunctionSpy, PropertySpy } from "../spying";

/**
 * Enables actual vs expected comparisons
 */
export interface IExpect {

  /**
   * Allows checking of test outcomes
   * @param actualValue - the value or function under test
   */
  <T>(actualValue: Array<T>): ContainerMatcher<Array<T>, T>;
  (actualValue: FunctionSpy | ((...args: Array<any>) => any)): FunctionMatcher;
  (actualValue: number): NumberMatcher;
  <T>(actualValue: PropertySpy<T>): PropertyMatcher<T>;
  (actualValue: object): EmptyMatcher<object>;
  (actualValue: string): StringMatcher;
  (actualValue: any): Matcher<any>;

  /**
   * Fails the test with the given message
   * @param message - the message that will be shown in the failure
   */
  fail(message: string): void;

  extend<R, S extends Matcher<R>>(type: new(...a: any[]) => R, matcher: new(value: R, testItem: any) => S): IExtendedExpect<R, S> & this;
}

export interface IExtendedExpect<ExpectType, MatcherType extends Matcher<ExpectType>> {

  /**
   * Allows checking of test outcomes
   * @param actualValue - the value or function under test
   */
  <N extends ExpectType>(actualValue: N): Matcher<N> & MatcherType;
}
