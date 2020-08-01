import {
	ITestCompleteEvent,
	ITestFixtureCompleteEvent,
	ITestFixtureStartedEvent,
	ITestRunStartedEvent,
	ITestRunCompleteEvent,
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
	private onTestStartedCBs: Array<CallbackFunction<ITestStartedEvent>> = [];
	private onTestCompleteCBs: Array<CallbackFunction<ITestCompleteEvent>> = [];
	private onTestRunStartedCBs: Array<CallbackFunction<ITestRunStartedEvent>> = [];
	private onTestRunCompleteCBs: Array<CallbackFunction<ITestRunCompleteEvent>> = [];
	private onTestFixtureStartedCBs: Array<CallbackFunction<ITestFixtureStartedEvent>> = [];
	private onTestFixtureCompleteCBs: Array<CallbackFunction<ITestFixtureCompleteEvent>> = [];
	private onWarningCBs: Array<CallbackFunction<IWarningEvent>> = [];
	private listenerInformer: ListenerInformer = new ListenerInformer();
	private eventFactory: EventFactory = new EventFactory();

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
		await this.listenerInformer.informListeners(this.onTestRunStartedCBs,
			this.eventFactory.createTestingStarted(testSetRunInfo));
		await this._runTests(testSetRunInfo, testSetResults);
	}

	/**
	 * Defined the call back function to be called when the test is started
	 */
	public onTestStarted(testStartedCB: CallbackFunction<ITestStartedEvent>) {
		this.onTestStartedCBs.push(testStartedCB);
	}

	/**
	 * Defined the call back function to be called when the test is completed
	 */
	public onTestComplete(testCompleteCB: CallbackFunction<ITestCompleteEvent>) {
		this.onTestCompleteCBs.push(testCompleteCB);
	}

	/**
	 * Defined the call back function to be called when test run has started
	 */
	public onTestRunStarted(testRunStartedCB: CallbackFunction<ITestRunStartedEvent>) {
		this.onTestRunStartedCBs.push(testRunStartedCB);
	}

	/**
	 * Defined the call back function to be called when test run is completed
	 */
	public onTestRunComplete(testRunCompletedCB: CallbackFunction<ITestRunCompleteEvent>) {
		this.onTestRunCompleteCBs.push(testRunCompletedCB);
	}

	/**
	 * Defined the call back function to be called when a test fixture starts to be tested
	 */
	public onTestFixtureStarted(testFixtureStartedCB: CallbackFunction<ITestFixtureStartedEvent>) {
		this.onTestFixtureStartedCBs.push(testFixtureStartedCB);
	}

	/**
	 * Defined the call back function to be called when a test fixture is completed
	 */
	public onTestFixtureComplete(testFixtureCompleteCB: CallbackFunction<ITestFixtureCompleteEvent>) {
		this.onTestFixtureCompleteCBs.push(testFixtureCompleteCB);
	}

	/**
	 * Defined the call back function to be called when a test fixture starts to be tested
	 */
	public onWarning(warningCB: CallbackFunction<IWarningEvent>) {
		this.onWarningCBs.push(warningCB);
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
			result => result.test === testItem.test
		);

		if (testResults === undefined) {
			testResults = testFixtureResults.addTestResult(testItem.test);
		}

		try {
			await testItem.run(testSetRunInfo.timeout);
			return testResults.addTestCaseResult(
				testItem.testCase.caseArguments
			);
		} catch (e) {
			return testResults.addTestCaseResult(
				testItem.testCase.caseArguments,
				e
			);
		}
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
		await this.listenerInformer.informListeners(this.onTestFixtureStartedCBs,
			this.eventFactory.createTestFixtureStarted(testFixture));

		for (const testItem of testFixtureItems) {
			await this._runTestItem(testItem, testSetRunInfo, testFixtureResults);
		}

		await this._runFixtureFunctions(
			testFixture.fixture,
			METADATA_KEYS.TEARDOWN_FIXTURE
		);
		await this.listenerInformer.informListeners(this.onTestFixtureCompleteCBs,
			this.eventFactory.createTestFixtureComplete(testFixture, testFixtureResults));
	}

	private async _runTestItem(
		testItem: TestItem,
		testSetRunInfo: TestSetRunInfo,
		testFixtureResults: TestFixtureResults) {
		await this.listenerInformer.informListeners(this.onTestStartedCBs,
			this.eventFactory.createTestStarted(testItem, testSetRunInfo));
		const result = await this._getTestItemResult(
			testItem,
			testSetRunInfo,
			testFixtureResults
		);

		await this.listenerInformer.informListeners(this.onTestCompleteCBs,
			this.eventFactory.createTestComplete(result, testItem, testSetRunInfo));
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
		Warner.warnings.forEach(warning => this.listenerInformer.informListeners(this.onWarningCBs,
			this.eventFactory.createWarning(warning)));
		await this.listenerInformer.informListeners(this.onTestRunCompleteCBs,
			this.eventFactory.createTestingComplete(testSetRunInfo, testSetResults));
	}
}
