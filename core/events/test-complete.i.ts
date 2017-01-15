import { ITestCase, ITest, ITestFixture } from "../_interfaces/index";
import { TestOutcome } from "../results/test-outcome";

export interface  ITestCompleteEvent {
    currentTestIndex: number;
    totalNumberOfTest: number;
    testCase: ITestCase;
    test: ITest;
    testFixture: ITestFixture;
    outcome: TestOutcome;
    error: Error;
}

export type IOnTestCompleteCBFunction = (testCompleted: ITestCompleteEvent) => void;