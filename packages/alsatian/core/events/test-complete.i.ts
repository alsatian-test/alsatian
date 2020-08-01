import { ITest, ITestCase, ITestFixture } from "../_interfaces";
import { TestOutcome } from "../results";
import {TestCaseResult} from "../results";

export interface ITestCompleteEvent {
	testId: number;
	testCase: ITestCase;
	test: ITest;
	testFixture: ITestFixture;
	outcome?: TestOutcome;
	error?: Error | null;
	testCaseResult: TestCaseResult;
}
