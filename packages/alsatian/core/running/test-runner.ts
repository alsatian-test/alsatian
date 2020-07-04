import "reflect-metadata";
import {
	METADATA_KEYS,
	TestFixtureResults,
	TestOutputStream,
	TestSet,
	TestSetResults
} from "../alsatian-core";
import { ISetupTeardownMetadata } from "../decorators/_interfaces";
import { IOnTestCompleteCBFunction } from "../events";
import { TestPlan } from "./test-plan";
import { TestSetRunInfo } from "./test-set-run-info";
import { TestItem } from "./test-item";
import { Warner } from "../maintenance/warn";

export class TestRunner {
	public readonly outputStream: TestOutputStream;
	private onTestCompleteCBs: Array<IOnTestCompleteCBFunction> = [];

	constructor(outputStream?: TestOutputStream) {
		// If we were given a TestOutput, use it, otherwise make one
		if (outputStream !== undefined) {
			this.outputStream = outputStream;
		} else {
			this.outputStream = new TestOutputStream();
		}
	}

	public async run(testSet: TestSet, timeout?: number | null) {
		const testPlan = new TestPlan(testSet);
		if (testPlan.testItems.length === 0) {
			throw new Error("no tests to run.");
		}

		if (!timeout) {
			timeout = 500;
		}

		const testSetResults = new TestSetResults();

		this.outputStream.emitVersion();
		this.outputStream.emitPlan(testPlan.testItems.length);

		const testSetRunInfo = new TestSetRunInfo(
			testPlan,
			testSetResults,
			timeout
		);

		await this.runTests(testSetRunInfo, testSetResults);
	}

	/**
	 * Defined the call back function to be called when the test is completed
	 */
	public onTestComplete(testCompleteCB: IOnTestCompleteCBFunction) {
		this.onTestCompleteCBs.push(testCompleteCB);
	}

	private async runTests(
		testSetRunInfo: TestSetRunInfo,
		results: TestSetResults
	) {
		const testItems = testSetRunInfo.testPlan.testItems;
		const testFixtures = this.getTestFixtures(testItems);

		for (const testFixture of testFixtures) {
			const testFixtureItems = testItems.filter(
				testItem => testItem.testFixture === testFixture
			);

			await this.setupFixture(testFixture.fixture);

			this.outputStream.emitFixture(testFixture);

			const testFixtureResults = results.addTestFixtureResult(
				testFixture
			);

			for (const testItem of testFixtureItems) {
				const result = await this.getTestItemResult(
					testItem,
					testSetRunInfo,
					testFixtureResults
				);

				this.onTestCompleteCBs.forEach(onTestCompleteCB => {
					onTestCompleteCB({
						error: result.error,
						outcome: result.outcome,
						test: testItem.test,
						testCase: testItem.testCase,
						testFixture: testItem.testFixture,
						testId:
							testSetRunInfo.testPlan.testItems.indexOf(
								testItem
							) + 1
					});
				});

				this.outputStream.emitResult(
					testItems.indexOf(testItem) + 1,
					result
				);
			}

			await this.teardownFixture(testFixture.fixture);
		}

		Warner.warnings.forEach(warning => this.outputStream.emitWarning(warning));

		this.outputStream.end();
	}

	private getTestFixtures(testItems: Array<TestItem>) {
		return testItems
			.map(testItem => testItem.testFixture)
			.filter(
				(fixture, index, array) => array.indexOf(fixture) === index
			);
	}

	private async getTestItemResult(
		testItem: TestItem,
		testSetRunInfo: TestSetRunInfo,
		testFixtureResults: TestFixtureResults
	) {
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

	private async setupFixture(fixture: { [key: string]: () => any }) {
		await this.runFixtureFunctions(fixture, METADATA_KEYS.SETUP_FIXTURE);
	}

	private async teardownFixture(fixture: { [key: string]: () => any }) {
		await this.runFixtureFunctions(
			fixture,
			METADATA_KEYS.TEARDOWN_FIXTURE
		);
	}

	private async runFixtureFunctions(
		fixture: { [key: string]: () => any },
		metadataKey: string
	) {
		const fixtureFunctions: Array<
			ISetupTeardownMetadata
		> = Reflect.getMetadata(metadataKey, fixture);

		if (fixtureFunctions) {
			for (const fixtureFunction of fixtureFunctions) {
				await fixture[fixtureFunction.propertyKey].call(fixture);
			}
		}
	}
}
