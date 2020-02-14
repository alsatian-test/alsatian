import {
	ITestCompleteEvent,
	ITestFixtureCompleteEvent,
	ITestFixtureStartedEvent,
	ITestingCompleteEvent,
	ITestingStartedEvent,
	ITestStartedEvent,
	IWarningEvent
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
import {ListenerInformer} from "./callback-listener-informer";
import {CallbackFunction} from "../events/generic-callback";
import {EventFactory} from "../events/event-factory";

export class CallbackTestRunner {
	private _onTestStartedCBs: Array<CallbackFunction<ITestStartedEvent>> = [];
	private _onTestCompleteCBs: Array<CallbackFunction<ITestCompleteEvent>> = [];
	private _onTestingStartedCBs: Array<CallbackFunction<ITestingStartedEvent>> = [];
	private _onTestingCompleteCBs: Array<CallbackFunction<ITestingCompleteEvent>> = [];
	private _onTestFixtureStartedCBs: Array<CallbackFunction<ITestFixtureStartedEvent>> = [];
	private _onTestFixtureCompleteCBs: Array<CallbackFunction<ITestFixtureCompleteEvent>> = [];
	private _onWarningCBs: Array<CallbackFunction<IWarningEvent>> = [];
	private _listenerInformer: ListenerInformer = new ListenerInformer();
	private _eventFactory: EventFactory = new EventFactory();

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
		await this._listenerInformer.informListeners(this._onTestingStartedCBs,
			this._eventFactory.createTestingStarted(testSetRunInfo));
		await this._runTests(testSetRunInfo, testSetResults);
	}

	/**
	 * Defined the call back function to be called when the test is started
	 */
	public onTestStarted(testStartedCB: CallbackFunction<ITestStartedEvent>) {
		this._onTestStartedCBs.push(testStartedCB);
	}

	/**
	 * Defined the call back function to be called when the test is completed
	 */
	public onTestComplete(testCompleteCB: CallbackFunction<ITestCompleteEvent>) {
		this._onTestCompleteCBs.push(testCompleteCB);
	}

	/**
	 * Defined the call back function to be called when testing has started
	 */
	public onTestingStarted(testingStartedCB: CallbackFunction<ITestingStartedEvent>) {
		this._onTestingStartedCBs.push(testingStartedCB);
	}

	/**
	 * Defined the call back function to be called when testing is completed
	 */
	public onTestingComplete(testingCompletedCB: CallbackFunction<ITestingCompleteEvent>) {
		this._onTestingCompleteCBs.push(testingCompletedCB);
	}

	/**
	 * Defined the call back function to be called when a test fixture starts to be tested
	 */
	public onTestFixtureStarted(testFixtureStartedCB: CallbackFunction<ITestFixtureStartedEvent>) {
		this._onTestFixtureStartedCBs.push(testFixtureStartedCB);
	}

	/**
	 * Defined the call back function to be called when a test fixture is completed
	 */
	public onTestFixtureComplete(testFixtureCompleteCB: CallbackFunction<ITestFixtureCompleteEvent>) {
		this._onTestFixtureCompleteCBs.push(testFixtureCompleteCB);
	}

	/**
	 * Defined the call back function to be called when a test fixture starts to be tested
	 */
	public onWarning(warningCB: CallbackFunction<IWarningEvent>) {
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
	): Promise<TestCaseResult> {
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
		}
		return result;
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

		await this._runFixtureFunctions(testFixture.fixture, METADATA_KEYS.SETUP_FIXTURE);
		const testFixtureResults = results.addTestFixtureResult(
			testFixture
		);
		await this._listenerInformer.informListeners(this._onTestFixtureStartedCBs,
			this._eventFactory.createTestFixtureStarted(testFixture));

		for (const testItem of testFixtureItems) {
			await this._runTestItem(testItem, testSetRunInfo, testFixtureResults);
		}

		await this._runFixtureFunctions(
			testFixture.fixture,
			METADATA_KEYS.TEARDOWN_FIXTURE
		);
		await this._listenerInformer.informListeners(this._onTestFixtureCompleteCBs,
			this._eventFactory.createTestFixtureComplete(testFixture, testFixtureResults));
	}

	private async _runTestItem(
		testItem: TestItem,
		testSetRunInfo: TestSetRunInfo,
		testFixtureResults: TestFixtureResults) {
		await this._listenerInformer.informListeners(this._onTestStartedCBs,
			this._eventFactory.createTestStarted(testItem, testSetRunInfo));
		const result = await this._getTestItemResult(
			testItem,
			testSetRunInfo,
			testFixtureResults
		);

		await this._listenerInformer.informListeners(this._onTestCompleteCBs,
			this._eventFactory.createTestComplete(result, testItem, testSetRunInfo));
	}

	private async _runTests(
		testSetRunInfo: TestSetRunInfo,
		testSetResults: TestSetResults
	) {
		const testItems = testSetRunInfo.testPlan.testItems;
		const testFixtures = this._getTestFixtures(testItems);

		for (const testFixture of testFixtures) {
			await this._runTestFixture(testFixture, testItems, testSetResults, testSetRunInfo);
		}
		Warner.warnings.forEach(warning => this._listenerInformer.informListeners(this._onWarningCBs,
			this._eventFactory.createWarning(warning)));
		await this._listenerInformer.informListeners(this._onTestingCompleteCBs,
			this._eventFactory.createTestingComplete(testSetRunInfo, testSetResults));
	}
}
