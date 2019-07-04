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
import { AnyFunction } from "../_interfaces";

/**
 * Enables actual vs expected comparisons
 */
export interface IExpect {
	/**
	 * Allows checking of test outcomes
	 * @param actualValue - the value or function under test
	 */
	<T>(actualValue: Array<T>): ContainerMatcher<Array<T>, T>;
	<T extends AnyFunction>(
		actualValue: FunctionSpy | T
	): FunctionMatcher<T>;
	(actualValue: number): NumberMatcher;
	<T>(actualValue: PropertySpy<T>): PropertyMatcher<T>;
	(actualValue: object): EmptyMatcher<object>;
	(actualValue: string): StringMatcher;
	<T>(actualValue: T): Matcher<T>;

	/**
	 * Fails the test with the given message
	 * @param message - the message that will be shown in the failure
	 */
	fail(message: string): void;

	extend<ExpectedType, MatcherType extends Matcher<ExpectedType>>(
		type: new (...args: Array<any>) => ExpectedType,
		matcher: new (value: ExpectedType, testItem: any) => MatcherType
	): IExtendedExpect<ExpectedType, MatcherType> & this;
}

export type IExtendedExpect<
	ExpectType,
	MatcherType extends Matcher<ExpectType>
> = <T extends ExpectType>(actualValue: T) => Matcher<T> & MatcherType;
