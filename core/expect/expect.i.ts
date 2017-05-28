import {
    ContainerMatcher,
    EmptyMatcher,
    FunctionMatcher,
    FunctionSpyMatcher,
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
    <T>(actualValue: T): Matcher<T>;

    /**
     * Fails the test with the given message
     * @param message - the message that will be shown in the failure
     */
    fail(message: string): void;
}
