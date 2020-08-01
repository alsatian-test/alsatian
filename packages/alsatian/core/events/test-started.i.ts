import { ITest, ITestCase, ITestFixture } from "../_interfaces";

export interface ITestStartedEvent {
	testId: number;
	testCase: ITestCase;
	test: ITest;
	testFixture: ITestFixture;

}
