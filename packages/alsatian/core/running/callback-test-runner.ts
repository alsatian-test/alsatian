import {
	IOnTestCompleteCBFunction, IOnTestFixtureCompleteCBFunction, IOnTestFixtureStartedCBFunction,
	IOnTestingCompleteCBFunction,
	IOnTestingStartedCBFunction,
	IOnTestStartedCBFunction, IOnWarningCBFunction
} from "../events";
import {TestSet} from "../test-set";
import {TestPlan} from "./test-plan";
import {TestCaseResult, TestFixtureResults, TestSetResults} from "../results";
import {TestSetRunInfo} from "./test-set-run-info";
import {TestItem} from "./test-item";
import {Warner} from "../maintenance/warn";
import {METADATA_KEYS} from "../alsatian-core";
import {ISetupTeardownMetadata} from "../decorators/_interfaces";
import {ITestFixture} from "../_interfaces";

export class CallbackTestRunner {
	private _onTestStartedCBs: Array<IOnTestStartedCBFunction> = [];
	private _onTestCompleteCBs: Array<IOnTestCompleteCBFunction> = [];
	private _onTestingStartedCBs: Array<IOnTestingStartedCBFunction> = [];
	private _onTestingCompleteCBs: Array<IOnTestingCompleteCBFunction> = [];
	private _onTestFixtureStartedCBs: Array<IOnTestFixtureStartedCBFunction> = [];
	private _onTestFixtureCompleteCBs: Array<IOnTestFixtureCompleteCBFunction> = [];
	private _onWarningCBs: Array<IOnWarningCBFunction> = [];
	private _flushedWarnings: Array<string> = [];

	public async run(testSet: TestSet, timeout?: number | null) {
		const testPlan = new TestPlan(testSet);
		if (testPlan.testItems.length === 0) {
			throw new Error("no tests to run.");
		}

		if (!timeout) {
			timeout = 500;
		}

		const testSetResults = new TestSetResults();
		const testSetRunInfo = new TestSetRunInfo(
			testPlan,
			testSetResults,
			timeout
		);
		await this._fireTestingStarted(testSetRunInfo);
		await this._runTests(testSetRunInfo, testSetResults);
	}

	/**
	 * Defined the call back function to be called when the test is started
	 */
	public onTestStarted(testStartedCB: IOnTestStartedCBFunction) {
		this._onTestStartedCBs.push(testStartedCB);
	}

	/**
	 * Defined the call back function to be called when the test is completed
	 */
	public onTestComplete(testCompleteCB: IOnTestCompleteCBFunction) {
		this._onTestCompleteCBs.push(testCompleteCB);
	}

	/**
	 * Defined the call back function to be called when testing has started
	 */
	public onTestingStarted(testingStartedCB: IOnTestingStartedCBFunction) {
		this._onTestingStartedCBs.push(testingStartedCB);
	}

	/**
	 * Defined the call back function to be called when testing is completed
	 */
	public onTestingComplete(testingStartedCB: IOnTestingStartedCBFunction) {
		this._onTestingCompleteCBs.push(testingStartedCB);
	}

	/**
	 * Defined the call back function to be called when a test fixture starts to be tested
	 */
	public onTestFixtureStarted(testFixtureStartedCB: IOnTestFixtureStartedCBFunction) {
		this._onTestFixtureStartedCBs.push(testFixtureStartedCB);
	}

	/**
	 * Defined the call back function to be called when a test fixture is completed
	 */
	public onTestFixtureComplete(testFixtureCompleteCB: IOnTestFixtureCompleteCBFunction) {
		this._onTestFixtureCompleteCBs.push(testFixtureCompleteCB);
	}

	/**
	 * Defined the call back function to be called when a test fixture starts to be tested
	 */
	public onWarning(warningCB: IOnWarningCBFunction) {
		this._onWarningCBs.push(warningCB);
	}

	private _getTestFixtures(testItems: Array<TestItem>) {
		return testItems
			.map(testItem => testItem.testFixture)
			.filter(
				(fixture, index, array) => array.indexOf(fixture) === index
			);
	}

	private async _getTestItemResult(
		testItem: TestItem,
		testSetRunInfo: TestSetRunInfo,
		testFixtureResults: TestFixtureResults
	) {
		let testResults = testFixtureResults.testResults.find(
			result2 => result2.test === testItem.test
		);

		if (testResults === undefined) {
			testResults = testFixtureResults.addTestResult(testItem.test);
		}

		let result: TestCaseResult = null;
		try {
			await testItem.run(testSetRunInfo.timeout);
			result = testResults.addTestCaseResult(
				testItem.testCase.caseArguments
			);
		} catch (e) {
			result = testResults.addTestCaseResult(
				testItem.testCase.caseArguments,
				e
			);
		} finally {
			const newWarnings = Warner.warnings
				.filter(
					(message, index, array) =>
						array.indexOf(message, index + 1) === -1
				)
				.filter(
					message => this._flushedWarnings.indexOf(message) === -1
				);
			for (const warning of newWarnings) {
				this._flushedWarnings.push(warning);
				await this._fireWarning(warning);
			}
		}
		return result;
	}

	private async _setupFixture(fixture: { [key: string]: () => any }) {
		await this._runFixtureFunctions(fixture, METADATA_KEYS.SETUP_FIXTURE);
	}

	private async _teardownFixture(fixture: { [key: string]: () => any }) {
		await this._runFixtureFunctions(
			fixture,
			METADATA_KEYS.TEARDOWN_FIXTURE
		);
	}

	private async _runFixtureFunctions(
		fixture: { [key: string]: () => any },
		metadataKey: string
	) {
		const fixtureFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(metadataKey, fixture);

		if (fixtureFunctions) {
			for (const fixtureFunction of fixtureFunctions) {
				await fixture[fixtureFunction.propertyKey].call(fixture);
			}
		}
	}

	private async _runTestFixture(
		testFixture: ITestFixture,
		testItems: Array<TestItem>,
		results: TestSetResults,
		testSetRunInfo: TestSetRunInfo) {
		const testFixtureItems = testItems.filter(
			testItem => testItem.testFixture === testFixture
		);

		await this._setupFixture(testFixture.fixture);
		const testFixtureResults = results.addTestFixtureResult(
			testFixture
		);
		await this._fireTestFixtureStarted(testFixture);

		for (const testItem of testFixtureItems) {
			await this._runTestItem(testItem, testSetRunInfo, testFixtureResults);
		}

		await this._teardownFixture(testFixture.fixture);
		await this._fireTestFixtureComplete(testFixture, testFixtureResults);
	}

	private async _runTestItem(
		testItem: TestItem,
		testSetRunInfo: TestSetRunInfo,
		testFixtureResults: TestFixtureResults) {
		await this._fireTestStarted(testItem, testSetRunInfo);
		const result = await this._getTestItemResult(
			testItem,
			testSetRunInfo,
			testFixtureResults
		);

		await this._fireTestComplete(result, testItem, testSetRunInfo);
	}

	private async _fireTestingStarted(testSetRunInfo: TestSetRunInfo) {
		for (const onTestingStartedCB of this._onTestingStartedCBs) {
			await onTestingStartedCB({
				testSetRunInfo
			});
		}
	}

	private async _fireTestFixtureStarted(testFixture: ITestFixture) {
		for (const onTestFixtureStartedCB of this._onTestFixtureStartedCBs) {
			await onTestFixtureStartedCB({
				testFixture
			});
		}
	}

	private async _fireTestFixtureComplete(testFixture: ITestFixture, testFixtureResults: TestFixtureResults) {
		for (const onTestFixtureCompleteCB of this._onTestFixtureCompleteCBs) {
			await onTestFixtureCompleteCB({
				testFixture,
				testFixtureResults
			});
		}
	}

	private async _fireWarning(warning: string) {
		for (const onWarningCB of this._onWarningCBs) {
			await onWarningCB({
				warning
			});
		}
	}

	private async _fireTestingCompleted(testSetRunInfo: TestSetRunInfo, testSetResults: TestSetResults) {
		for (const onTestingCompleteCB of this._onTestingCompleteCBs) {
			await onTestingCompleteCB({
				testSetRunInfo,
				testSetResults
			});
		}
	}

	private async _fireTestComplete(result: TestCaseResult, testItem: TestItem, testSetRunInfo: TestSetRunInfo) {
		for (const onTestCompleteCB of this._onTestCompleteCBs) {
			await onTestCompleteCB({
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
			});
		}
	}

	private async _fireTestStarted(testItem: TestItem, testSetRunInfo: TestSetRunInfo) {
		for (const onTestStartedCB of this._onTestStartedCBs) {
			await onTestStartedCB({
				test: testItem.test,
				testCase: testItem.testCase,
				testFixture: testItem.testFixture,
				testId:
					testSetRunInfo.testPlan.testItems.indexOf(
						testItem
					) + 1,
			});
		}
	}

	private async _runTests(
		testSetRunInfo: TestSetRunInfo,
		results: TestSetResults
	) {
		const testItems = testSetRunInfo.testPlan.testItems;
		const testFixtures = this._getTestFixtures(testItems);

		for (const testFixture of testFixtures) {
			await this._runTestFixture(testFixture, testItems, results, testSetRunInfo);
		}
		await this._fireTestingCompleted(testSetRunInfo, results);
	}
}
