import {TestItem, TestSetRunInfo} from "../running";
import {ITestCompleteEvent} from "./test-complete.i";
import {TestCaseResult, TestFixtureResults, TestSetResults} from "../results";
import {IWarningEvent} from "./warning.i";
import {ITestFixture} from "../_interfaces";
import {ITestFixtureStartedEvent} from "./test-fixture-started.i";
import {ITestFixtureCompleteEvent} from "./test-fixture-complete.i";
import { ITestStartedEvent } from "./test-started.i";
import { ITestRunStartedEvent } from "./test-run-started.i";
import { ITestRunCompleteEvent } from "./test-run-complete.i";

export class EventFactory {
	public createTestComplete(result: TestCaseResult, testItem: TestItem, testSetRunInfo: TestSetRunInfo)
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
		: ITestRunCompleteEvent {
		return {
			testSetRunInfo,
			testSetResults
		};
	}

	public createWarning(warning: string): IWarningEvent {
		return {warning};
	}

	public createTestingStarted(testSetRunInfo: TestSetRunInfo): ITestRunStartedEvent {
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
