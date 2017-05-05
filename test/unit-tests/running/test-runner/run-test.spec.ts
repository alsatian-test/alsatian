import "reflect-metadata";
import { AsyncTest, Expect, METADATA_KEYS, SpyOn, TestCase, Timeout } from "../../../../core/alsatian-core";
import { ITestCompleteEvent } from "../../../../core/events";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestOutputStream } from "../../../../core/test-output-stream";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestSetBuilder } from "../../../builders/test-set-builder";

export class RunTestTests {

    @AsyncTest()
    public async singlePassingTestRunsSuccessfully() {

        const test = new TestBuilder().withTestCaseCount(1).build();

        const testFixture = new TestFixtureBuilder()
            .addTest(test)
            .build();

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const testRunner = new TestRunner(outputStream);

        await testRunner.run(testSet);
        Expect(outputStream.push).toHaveBeenCalledWith("ok 1 Test Function\n");
    }

    @AsyncTest()
    public async singlePassingTestRunsSuccessfullyWithOnCompleteEventRaised() {
        let testCompletedValue: ITestCompleteEvent = null;
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

        let spyContainer = {
            onCompleteCB: (testCompleted: ITestCompleteEvent) => {
                testCompletedValue = testCompleted;
            }
        };

        SpyOn(spyContainer, "onCompleteCB");
        testRunner.onTestComplete(spyContainer.onCompleteCB);

        await testRunner.run(testSet);

        Expect(spyContainer.onCompleteCB).toHaveBeenCalled().exactly(1);

        Expect(testCompletedValue.testId).toEqual(1);
        Expect(testCompletedValue.test.description).toEqual(testDescription);
        Expect(testCompletedValue.testFixture.description).toEqual(testFixtureDescription);
        Expect(testCompletedValue.outcome).not.toBeNull();
        Expect(testCompletedValue.testCase).not.toBeNull();
        Expect(testCompletedValue.error).toBeNull();

    }

    @AsyncTest()
    public async singlePassingTestRunsSuccessfullyWithoutOnCompleteEventRaised() {
        let testCompletedValue: ITestCompleteEvent = null;
        const test = new TestBuilder().withTestCaseCount(1).build();

        const testFixture = new TestFixtureBuilder()
            .addTest(test)
            .build();

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();

        const testRunner = new TestRunner(outputStream);

        let spyContainer = {
            onCompleteCB: (testCompleted: ITestCompleteEvent) => {
                testCompletedValue = testCompleted;
            }
        };

        SpyOn(spyContainer, "onCompleteCB");
        // same as before test, but no CB registered
        // testRunner.onTestComplete(spyContainer.onCompleteCB);

        await testRunner.run(testSet);

        Expect(spyContainer.onCompleteCB).not.toHaveBeenCalled();
    }

    @AsyncTest()
    public async singlePassingTestRunsSuccessfullyWithSeveralOnCompleteEventRaised() {
        let testCompletedValue1: ITestCompleteEvent = null;
        let testCompletedValue2: ITestCompleteEvent = null;
        const test = new TestBuilder().withTestCaseCount(1).build();

        const testFixture = new TestFixtureBuilder()
            .addTest(test)
            .build();

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();

        const testRunner = new TestRunner(outputStream);

        let spyContainer = {
            onCompleteCB1: (testCompleted: ITestCompleteEvent) => {
                testCompletedValue1 = testCompleted;
            },
            onCompleteCB2: (testCompleted: ITestCompleteEvent) => {
                testCompletedValue2 = testCompleted;
            }
        };

        SpyOn(spyContainer, "onCompleteCB1");
        SpyOn(spyContainer, "onCompleteCB2");
        testRunner.onTestComplete(spyContainer.onCompleteCB1);
        testRunner.onTestComplete(spyContainer.onCompleteCB2);

        await testRunner.run(testSet);
        Expect(spyContainer.onCompleteCB1).toHaveBeenCalled().exactly(1);
        Expect(spyContainer.onCompleteCB2).toHaveBeenCalled().exactly(1);
    }

    @AsyncTest()
    @Timeout(600)
    public async singleTestTakes501msFails() {

        const test = new TestBuilder()
            .withTestCaseCount(1)
            .withKey("testFunction")
            .withIsAsync(true)
            .build();

        const fixtureObject = {
            testFunction: () => {
                return new Promise((resolve, reject) => setTimeout(() => resolve(), 501));
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
        Expect(outputStream.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
    }

    @AsyncTest()
    public async singleTestTakes100msWith50msTimeoutFails() {

        const test = new TestBuilder()
            .withTestCaseCount(1)
            .withKey("testFunction")
            .withIsAsync(true)
            .build();

        const fixtureObject = {
            testFunction: () => {
                return new Promise((resolve, reject) => setTimeout(() => resolve(), 100));
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
        Expect(outputStream.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
    }

    @AsyncTest()
    public async singleTestThrowsErrorFails() {

        const test = new TestBuilder()
            .withTestCaseCount(1)
            .withKey("testFunction")
            .build();

        const fixtureObject = {
            setupFunction: () => { throw new Error("setup failed"); },
            testFunction: () => {
                throw new Error("everything has blown up");
            }
        };

        Reflect.defineMetadata(METADATA_KEYS.TEARDOWN, ["setupFunction"], fixtureObject);

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
        Expect(outputStream.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
    }

    @AsyncTest()
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
        Expect(outputStream.push).toHaveBeenCalledWith("ok 1 Test Function\n");
        Expect(outputStream.push).toHaveBeenCalledWith("ok 2 Test Function\n");
    }

    @AsyncTest()
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
                return new Promise((resolve, reject) => setTimeout(() => resolve(), 501));
            },
            secondTestFunction: () => {
                return new Promise((resolve, reject) => setTimeout(() => resolve(), 10));
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
        Expect(outputStream.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
        Expect(outputStream.push).toHaveBeenCalledWith("ok 2 Test Function\n");
    }

    @AsyncTest()
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
                return new Promise((resolve, reject) => setTimeout(() => resolve(), 10));
            },
            secondTestFunction: () => {
                return new Promise((resolve, reject) => setTimeout(() => resolve(), 501));
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
        Expect(outputStream.push).toHaveBeenCalledWith("ok 1 Test Function\n");
        Expect(outputStream.push).toHaveBeenCalledWith("not ok 2 Test Function\n");
    }

    @AsyncTest()
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
                return new Promise((resolve, reject) => setTimeout(() => resolve(), 100));
            },
            secondTestFunction: () => {
                return new Promise((resolve, reject) => setTimeout(() => resolve(), 10));
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
        Expect(outputStream.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
        Expect(outputStream.push).toHaveBeenCalledWith("ok 2 Test Function\n");
    }

    @AsyncTest()
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
                return new Promise((resolve, reject) => setTimeout(() => resolve(), 10));
            },
            secondTestFunction: () => {
                return new Promise((resolve, reject) => setTimeout(() => resolve(), 100));
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
        Expect(outputStream.push).toHaveBeenCalledWith("ok 1 Test Function\n");
        Expect(outputStream.push).toHaveBeenCalledWith("not ok 2 Test Function\n");
    }

    @TestCase(true)
    @TestCase(false)
    @AsyncTest("simulate user passing reportLocation to testRunner.run")
    public async singlePassingTestRunsSuccessfullyReportLocation(reportLocation: boolean) {

        const test = new TestBuilder().withTestCaseCount(1).build();

        const testFixture = new TestFixtureBuilder()
            .addTest(test)
            .build();

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const testRunner = new TestRunner(outputStream);

        await testRunner.run(testSet, undefined, reportLocation);
        Expect(outputStream.push).toHaveBeenCalledWith("ok 1 Test Function\n");
    }

}
