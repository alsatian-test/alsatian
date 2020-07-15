import { ITest, ITestCase, ITestFixture } from "../_interfaces";

export interface ITestRunStartedEvent {
	testId: number;
	testCase: ITestCase;
	test: ITest;
	testFixture: ITestFixture;

}
