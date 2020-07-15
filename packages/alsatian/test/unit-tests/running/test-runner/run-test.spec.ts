import "reflect-metadata";
import {
	AsyncTest,
	Expect,
	METADATA_KEYS,
	SpyOn,
	TestFixture,
	Timeout,
	Setup,
	Teardown, TestOutcome
} from "../../../../core/alsatian-core";
import {ITestRunCompleteEvent, ITestFixtureCompleteEvent, ITestRunStartedEvent} from "../../../../core/events";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestOutputStream } from "../../../../core/test-output-stream";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestSetBuilder } from "../../../builders/test-set-builder";
import { TestPlan } from "../../../../core/running";

@TestFixture("test set run tests")
export class RunTestTests {
	private originalTestPlan: TestPlan;

	@Setup
	private recordOriginalTestPlan() {
		this.originalTestPlan = Reflect.getMetadata(
			"alsatian:test-plan",
			Expect
		);
	}

	@Teardown
	private restoreOriginalTestPlan() {
		Reflect.defineMetadata(
			"alsatian:test-plan",
			this.originalTestPlan,
			Expect
		);
	}

	@AsyncTest("a single passing test can be run successfully")
	public async singlePassingTestRunsSuccessfully() {
		const test = new TestBuilder().withTestCaseCount(1).build();

		const testFixture = new TestFixtureBuilder().addTest(test).build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();
		SpyOn(outputStream, "push");

		const testRunner = new TestRunner(outputStream);

		await testRunner.run(testSet);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"ok 1 Unnamed Test Fixture > Test Function\n"
		);
	}

	@AsyncTest("a passing test can be run with on complete event")
	public async singlePassingTestRunsSuccessfullyWithOnCompleteEventRaised() {
		let testCompletedValue: ITestRunCompleteEvent = null;
		const testDescription = "testDescriptionToCheck";
		const test = new TestBuilder()
			.withDescription(testDescription)
			.withTestCaseCount(1)
			.build();

		const testFixtureDescription = "testFixtureDescriptionToCheck";
		const testFixture = new TestFixtureBuilder()
			.withDescription(testFixtureDescription)
			.addTest(test)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();

		const testRunner = new TestRunner(outputStream);

		const spyContainer = {
			onCompleteCB: (testCompleted: ITestRunCompleteEvent) => {
				testCompletedValue = testCompleted;
			}
		};

		SpyOn(spyContainer, "onCompleteCB");
		testRunner.onTestComplete(spyContainer.onCompleteCB);

		await testRunner.run(testSet);

		this.restoreOriginalTestPlan();

		Expect(spyContainer.onCompleteCB)
			.toHaveBeenCalled()
			.exactly(1);

		Expect(testCompletedValue.testId).toEqual(1);
		Expect(testCompletedValue.test.description).toEqual(testDescription);
		Expect(testCompletedValue.testFixture.description).toEqual(
			testFixtureDescription
		);
		Expect(testCompletedValue.outcome).not.toBeNull();
		Expect(testCompletedValue.testCase).not.toBeNull();
		Expect(testCompletedValue.error).toBeNull();
	}
	@AsyncTest("a passing test can be run with on started event")
	public async singlePassingTestRunsSuccessfullyWithOnStartedEventRaised() {
		let testStartedValue: ITestRunStartedEvent = null;
		const testDescription = "testDescriptionToCheck";
		const test = new TestBuilder()
			.withDescription(testDescription)
			.withTestCaseCount(1)
			.build();

		const testFixtureDescription = "testFixtureDescriptionToCheck";
		const testFixture = new TestFixtureBuilder()
			.withDescription(testFixtureDescription)
			.addTest(test)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();

		const testRunner = new TestRunner(outputStream);

		const spyContainer = {
			onStartedCB: (testStarted: ITestRunStartedEvent) => {
				testStartedValue = testStarted;
			}
		};

		SpyOn(spyContainer, "onStartedCB");
		testRunner.onTestStarted(spyContainer.onStartedCB);

		await testRunner.run(testSet);

		this.restoreOriginalTestPlan();

		Expect(spyContainer.onStartedCB)
			.toHaveBeenCalled()
			.exactly(1);

		Expect(testStartedValue.testId).toEqual(1);
		Expect(testStartedValue.test.description).toEqual(testDescription);
		Expect(testStartedValue.testFixture.description).toEqual(
			testFixtureDescription
		);
		Expect(testStartedValue.test.key).not.toBeNull();
		Expect(testStartedValue.test.description).not.toBeNull();
		Expect(testStartedValue.test.ignored).toBe(false);
	}

	@AsyncTest("a passing test can be run with on started event")
	public async singlePassingTestRunsSuccessfullyWithOnTestFixtureCompleteEventRaised() {
		let testTestFixtureCompleteValue: ITestFixtureCompleteEvent = null;
		const testDescription = "testDescriptionToCheck";
		const test = new TestBuilder()
			.withDescription(testDescription)
			.withTestCaseCount(1)
			.build();

		const testFixtureDescription = "testFixtureDescriptionToCheck";
		const testFixture = new TestFixtureBuilder()
			.withDescription(testFixtureDescription)
			.addTest(test)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();

		const testRunner = new TestRunner(outputStream);

		const spyContainer = {
			onTestFixtureCompleteCB: (testTestFixtureComplete: ITestFixtureCompleteEvent) => {
				testTestFixtureCompleteValue = testTestFixtureComplete;
			}
		};

		SpyOn(spyContainer, "onTestFixtureCompleteCB");
		testRunner.onTestFixtureComplete(spyContainer.onTestFixtureCompleteCB);

		await testRunner.run(testSet);

		this.restoreOriginalTestPlan();

		Expect(spyContainer.onTestFixtureCompleteCB)
			.toHaveBeenCalled()
			.exactly(1);

		Expect(testTestFixtureCompleteValue.testFixture).not.toBeNull();
		Expect(testTestFixtureCompleteValue.testFixtureResults.outcome).toBe(TestOutcome.Pass);
	}

	@AsyncTest(
		"single passing test can be run successfully without on complete event"
	)
	public async singlePassingTestRunsSuccessfullyWithoutOnCompleteEventRaised() {
		let testCompletedValue: ITestRunCompleteEvent = null;
		const test = new TestBuilder().withTestCaseCount(1).build();

		const testFixture = new TestFixtureBuilder().addTest(test).build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();

		const testRunner = new TestRunner(outputStream);

		const spyContainer = {
			onCompleteCB: (testCompleted: ITestRunCompleteEvent) => {
				testCompletedValue = testCompleted;
			}
		};

		SpyOn(spyContainer, "onCompleteCB");
		// same as before test, but no CB registered
		// testRunner.onTestComplete(spyContainer.onCompleteCB);

		await testRunner.run(testSet);

		Expect(spyContainer.onCompleteCB).not.toHaveBeenCalled();
	}

	@AsyncTest(
		"single passing test can be run succesffully with multiple on complete events"
	)
	public async singlePassingTestRunsSuccessfullyWithSeveralOnCompleteEventRaised() {
		let testCompletedValue1: ITestRunCompleteEvent = null;
		let testCompletedValue2: ITestRunCompleteEvent = null;
		const test = new TestBuilder().withTestCaseCount(1).build();

		const testFixture = new TestFixtureBuilder().addTest(test).build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();

		const testRunner = new TestRunner(outputStream);

		const spyContainer = {
			onCompleteCB1: (testCompleted: ITestRunCompleteEvent) => {
				testCompletedValue1 = testCompleted;
			},
			onCompleteCB2: (testCompleted: ITestRunCompleteEvent) => {
				testCompletedValue2 = testCompleted;
			}
		};

		SpyOn(spyContainer, "onCompleteCB1");
		SpyOn(spyContainer, "onCompleteCB2");
		testRunner.onTestComplete(spyContainer.onCompleteCB1);
		testRunner.onTestComplete(spyContainer.onCompleteCB2);

		await testRunner.run(testSet);
		Expect(spyContainer.onCompleteCB1)
			.toHaveBeenCalled()
			.exactly(1);
		Expect(spyContainer.onCompleteCB2)
			.toHaveBeenCalled()
			.exactly(1);
	}

	@AsyncTest("single test that exceeds timeout fails")
	@Timeout(600)
	public async singleTestTakes501msFails() {
		const test = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("testFunction")
			.withIsAsync(true)
			.build();

		const fixtureObject = {
			testFunction: () => {
				return new Promise((resolve, reject) =>
					setTimeout(() => resolve(), 501)
				);
			}
		};

		const testFixture = new TestFixtureBuilder()
			.withFixture(fixtureObject)
			.addTest(test)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();
		SpyOn(outputStream, "push");

		const testRunner = new TestRunner(outputStream);

		await testRunner.run(testSet);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"not ok 1 Unnamed Test Fixture > Test Function\n"
		);
	}

	@AsyncTest("single test that exceeds custom timeout fails")
	public async singleTestTakes100msWith50msTimeoutFails() {
		const test = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("testFunction")
			.withIsAsync(true)
			.build();

		const fixtureObject = {
			testFunction: () => {
				return new Promise((resolve, reject) =>
					setTimeout(() => resolve(), 100)
				);
			}
		};

		const testFixture = new TestFixtureBuilder()
			.withFixture(fixtureObject)
			.addTest(test)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();
		SpyOn(outputStream, "push");

		const testRunner = new TestRunner(outputStream);

		await testRunner.run(testSet, 50);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"not ok 1 Unnamed Test Fixture > Test Function\n"
		);
	}

	@AsyncTest("single test that throws an error fails")
	public async singleTestThrowsErrorFails() {
		const test = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("testFunction")
			.build();

		const fixtureObject = {
			setupFunction: () => {
				throw new Error("setup failed");
			},
			testFunction: () => {
				throw new Error("everything has blown up");
			}
		};

		Reflect.defineMetadata(
			METADATA_KEYS.TEARDOWN,
			["setupFunction"],
			fixtureObject
		);

		const testFixture = new TestFixtureBuilder()
			.withFixture(fixtureObject)
			.addTest(test)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();
		SpyOn(outputStream, "push");

		const testRunner = new TestRunner(outputStream);

		await testRunner.run(testSet);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"not ok 1 Unnamed Test Fixture > Test Function\n"
		);
	}

	@AsyncTest("two passing tests run successfully")
	public async twoPassingTestsRunsSuccessfully() {
		const firstTest = new TestBuilder().withTestCaseCount(1).build();
		const secondTest = new TestBuilder().withTestCaseCount(1).build();

		const testFixture = new TestFixtureBuilder()
			.addTest(firstTest)
			.addTest(secondTest)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();
		SpyOn(outputStream, "push");

		const testRunner = new TestRunner(outputStream);

		await testRunner.run(testSet);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"ok 1 Unnamed Test Fixture > Test Function\n"
		);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"ok 2 Unnamed Test Fixture > Test Function\n"
		);
	}

	@AsyncTest("two tests first exceeds timeout fails")
	@Timeout(1000)
	public async twoTestsFirstTakes501msFails() {
		const firstTest = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("firstTestFunction")
			.withIsAsync(true)
			.build();

		const secondTest = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("secondTestFunction")
			.withIsAsync(true)
			.build();

		const fixtureObject = {
			firstTestFunction: () => {
				return new Promise((resolve, reject) =>
					setTimeout(() => resolve(), 501)
				);
			},
			secondTestFunction: () => {
				return new Promise((resolve, reject) =>
					setTimeout(() => resolve(), 10)
				);
			}
		};

		const testFixture = new TestFixtureBuilder()
			.withFixture(fixtureObject)
			.addTest(firstTest)
			.addTest(secondTest)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();
		SpyOn(outputStream, "push");

		const testRunner = new TestRunner(outputStream);

		await testRunner.run(testSet);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"not ok 1 Unnamed Test Fixture > Test Function\n"
		);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"ok 2 Unnamed Test Fixture > Test Function\n"
		);
	}

	@AsyncTest("two tests, second exceeds timeout fails")
	@Timeout(1000)
	public async twoTestsSecondTakes501msFails() {
		const firstTest = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("firstTestFunction")
			.withIsAsync(true)
			.build();

		const secondTest = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("secondTestFunction")
			.withIsAsync(true)
			.build();

		const fixtureObject = {
			firstTestFunction: () => {
				return new Promise((resolve, reject) =>
					setTimeout(() => resolve(), 10)
				);
			},
			secondTestFunction: () => {
				return new Promise((resolve, reject) =>
					setTimeout(() => resolve(), 501)
				);
			}
		};

		const testFixture = new TestFixtureBuilder()
			.withFixture(fixtureObject)
			.addTest(firstTest)
			.addTest(secondTest)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();
		SpyOn(outputStream, "push");

		const testRunner = new TestRunner(outputStream);

		await testRunner.run(testSet);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"ok 1 Unnamed Test Fixture > Test Function\n"
		);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"not ok 2 Unnamed Test Fixture > Test Function\n"
		);
	}

	@AsyncTest("two tests first exceeds custom timeout fails")
	public async twoTestsFirstTakes100msWith50msTimeoutFails() {
		const firstTest = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("firstTestFunction")
			.withIsAsync(true)
			.build();

		const secondTest = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("secondTestFunction")
			.withIsAsync(true)
			.build();

		const fixtureObject = {
			firstTestFunction: () => {
				return new Promise((resolve, reject) =>
					setTimeout(() => resolve(), 100)
				);
			},
			secondTestFunction: () => {
				return new Promise((resolve, reject) =>
					setTimeout(() => resolve(), 10)
				);
			}
		};

		const testFixture = new TestFixtureBuilder()
			.withFixture(fixtureObject)
			.addTest(firstTest)
			.addTest(secondTest)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();
		SpyOn(outputStream, "push");

		const testRunner = new TestRunner(outputStream);

		await testRunner.run(testSet, 50);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"not ok 1 Unnamed Test Fixture > Test Function\n"
		);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"ok 2 Unnamed Test Fixture > Test Function\n"
		);
	}

	@AsyncTest("two tests second exceeds custom timeout fails")
	public async twoTestsSecondTakes100msWith50msTimeoutFails() {
		const firstTest = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("firstTestFunction")
			.withIsAsync(true)
			.build();

		const secondTest = new TestBuilder()
			.withTestCaseCount(1)
			.withKey("secondTestFunction")
			.withIsAsync(true)
			.build();

		const fixtureObject = {
			firstTestFunction: () => {
				return new Promise((resolve, reject) =>
					setTimeout(() => resolve(), 10)
				);
			},
			secondTestFunction: () => {
				return new Promise((resolve, reject) =>
					setTimeout(() => resolve(), 100)
				);
			}
		};

		const testFixture = new TestFixtureBuilder()
			.withFixture(fixtureObject)
			.addTest(firstTest)
			.addTest(secondTest)
			.build();

		const testSet = new TestSetBuilder()
			.addTestFixture(testFixture)
			.build();

		const outputStream = new TestOutputStream();
		SpyOn(outputStream, "push");

		const testRunner = new TestRunner(outputStream);

		await testRunner.run(testSet, 50);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"ok 1 Unnamed Test Fixture > Test Function\n"
		);
		Expect(outputStream.push).toHaveBeenCalledWith(
			"not ok 2 Unnamed Test Fixture > Test Function\n"
		);
	}
}
