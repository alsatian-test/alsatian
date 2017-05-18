import { MatchError } from "./errors";
import {
    ContainerMatcher,
    EmptyMatcher,
    FunctionMatcher,
    FunctionSpyMatcher,
    Matcher,
    MixedMatcher,
    NumberMatcher,
    PropertyMatcher,
    StringMatcher
} from "./matchers";
import { FunctionSpy, PropertySpy } from "./spying";

/**
 * Enables actual vs expected comparisons
 */
export interface IExpect {
    /**
     * Allows checking of test outcomes
     * @param actualValue - the value or function under test
     */
    <T>(actualValue: Array<T>): ContainerMatcher<Array<T>, T>;
    (actualValue: FunctionSpy | Function): FunctionMatcher;
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

function ExpectFunction<T>(actualValue: T): Matcher<T> {
   return new MixedMatcher(actualValue);
}

function fail(message: string) {
    throw new MatchError(message);
}

const EXPECT = ExpectFunction as IExpect;
EXPECT.fail = fail;

export {
    EXPECT as Expect
};
