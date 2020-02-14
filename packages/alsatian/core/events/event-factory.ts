import {TestItem, TestSetRunInfo} from "../running";
import {ITestCompleteEvent} from "./test-complete.i";
import {ITestingCompleteEvent} from "./testing-completed.i";
import {TestFixtureResults, TestSetResults} from "../results";
import {IWarningEvent} from "./warning.i";
import {ITestingStartedEvent} from "./testing-started.i";
import {ITestFixture} from "../_interfaces";
import {ITestFixtureStartedEvent} from "./test-fixture-started.i";
import {ITestFixtureCompleteEvent} from "./test-fixture-complete.i";
import {ITestStartedEvent} from "./test-started.i";

export class EventFactory {
	public createTestComplete(result, testItem: TestItem, testSetRunInfo: TestSetRunInfo)
		: ITestCompleteEvent {
		return {
			error: result.error,
			outcome: result.outcome,
			test: testItem.test,
			testCase: testItem.testCase,
			testFixture: testItem.testFixture,
			testId:
				testSetRunInfo.testPlan.testItems.indexOf(
					testItem
				) + 1,
			testCaseResult: result
		};
	}

	public createTestingComplete(testSetRunInfo: TestSetRunInfo, testSetResults: TestSetResults)
		: ITestingCompleteEvent {
		return {
			testSetRunInfo,
			testSetResults
		};
	}

	public createWarning(warning: string): IWarningEvent {
		return {warning};
	}

	public createTestingStarted(testSetRunInfo: TestSetRunInfo): ITestingStartedEvent {
		return {testSetRunInfo};
	}

	public createTestFixtureStarted(testFixture: ITestFixture): ITestFixtureStartedEvent {
		return {testFixture};
	}

	public createTestFixtureComplete(testFixture: ITestFixture, testFixtureResults: TestFixtureResults)
		: ITestFixtureCompleteEvent {
		return {
			testFixture,
			testFixtureResults
		};
	}

	public createTestStarted(testItem: TestItem, testSetRunInfo: TestSetRunInfo): ITestStartedEvent {
		return {
			test: testItem.test,
			testCase: testItem.testCase,
			testFixture: testItem.testFixture,
			testId:
				testSetRunInfo.testPlan.testItems.indexOf(
					testItem
				) + 1,
		};
	}
}
