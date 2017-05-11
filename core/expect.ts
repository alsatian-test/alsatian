import { MatchError } from "./errors";
import { Matcher } from "./matchers";

/**
 * Enables actual vs expected comparisons
 */
export interface IExpect {
    /**
     * Allows checking of test outcomes
     * @param actualValue - the value or function under test
     */
    (actualValue: any): Matcher;

    /**
     * Fails the test with the given message
     * @param message - the message that will be shown in the failure
     */
    fail(message: string): void;
}

function ExpectFunction(actualValue: any) {
   return new Matcher(actualValue);
}

function fail(message: string) {
    throw new MatchError(message);
}

const EXPECT = (ExpectFunction as IExpect);
EXPECT.fail = fail;

export {
    EXPECT as Expect
};
