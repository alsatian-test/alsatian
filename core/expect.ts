import { MatchError } from "./errors";
import { 
    ArrayMatcher,
    FunctionMatcher,
    FunctionSpyMatcher,
    FunctionWithArgumentsMatcher,
    Matcher,
    NumberMatcher,
    ObjectMatcher,
    PropertyMatcher,
    StringMatcher
} from "./matchers";
import { FunctionSpy, PropertySpy } from "./spying";

/** 
 * THINGS TO SUPPORT
 * =================
 * NO ARGUMENTS
 * TYPED ARGUMENTS
 * OPTIONAL ARGUMENTS
 * INFINITE ARGUMENTS
 */

export interface FunctionWithNoArguments<ReturnType> {
    (): ReturnType;
}

export interface FunctionWithTwoArguments<ReturnType, ArgumentOneType, ArgumentTwoType> {
    (argument: ArgumentOneType, argumentTwo: ArgumentTwoType): ReturnType;
}

export interface FunctionWithOneArgument<ReturnType, ArgumentType> {
    (argument: ArgumentType): ReturnType;
}

export interface IFunctionWithOneArgumentMatcher<T, U> {    
   toHaveBeenCalledWith(arg1: U): FunctionSpyMatcher;
}

export interface IFunctionWithTwoArgumentsMatcher<T, U, V> {    
   toHaveBeenCalledWith(arg1: U, arg2: V): FunctionSpyMatcher;
}

/**
 * Enables actual vs expected comparisons
 */
export interface IExpect {
    /**
     * Allows checking of test outcomes
     * @param actualValue - the value or function under test
     */
    <T>(actualValue: Array<T>): ArrayMatcher<T>;
    (actualValue: FunctionSpy | FunctionWithNoArguments<any>): FunctionMatcher;
    <T, U>(actualValue: FunctionSpy | FunctionWithOneArgument<T, U>): IFunctionWithOneArgumentMatcher<T, U>;
    <T, U, V>(actualValue: FunctionSpy | FunctionWithTwoArguments<T, U, V>): IFunctionWithTwoArgumentsMatcher<T, U, V>;
    (actualValue: number): NumberMatcher;
    <T>(actualValue: PropertySpy<T>): PropertyMatcher<T>;
    (actualValue: object): ObjectMatcher;
    (actualValue: string): StringMatcher;
    <T>(actualValue: T): Matcher<T>;
    <T>(actualValue: T): Matcher<T>

    /**
     * Fails the test with the given message
     * @param message - the message that will be shown in the failure
     */
    fail(message: string): void;
}

function ExpectFunction<T>(actualValue: T): Matcher<T> {
   return new Matcher(actualValue);
}

function fail(message: string) {
    throw new MatchError(message);
}

const EXPECT = ExpectFunction as IExpect;
EXPECT.fail = fail;

export {
    EXPECT as Expect
};

EXPECT((test: string, some: number) => {}).toHaveBeenCalledWith("test", 42);
