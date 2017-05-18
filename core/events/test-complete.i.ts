import { ITest, ITestCase, ITestFixture } from "../_interfaces/index";
import { ErrorOrNull } from "../errors";
import { TestOutcome } from "../results/test-outcome";

export interface  ITestCompleteEvent {
    testId: number;
    testCase: ITestCase;
    test: ITest;
    testFixture: ITestFixture;
    outcome?: TestOutcome;
    error?: ErrorOrNull;
}

export type IOnTestCompleteCBFunction = (testCompleted: ITestCompleteEvent) => void;
