/* tslint:disable:no-unused-expression */

import { AsyncTest,
         Expect,
         FunctionSpy,
         METADATA_KEYS,
         SpyOn,
         TestCase,
         TestFixture } from "../../../../core/alsatian-core";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestOutputStream } from "../../../../core/test-output-stream";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestSetBuilder } from "../../../builders/test-set-builder";

@TestFixture("setting up tests")
export class SetupTests {

    private _createTestFixture() {
        const test = new TestBuilder()
            .withTestCaseCount(1)
            .withKey("testFunction")
            .build();

        const fixtureObject = {
            setupFunction: (new FunctionSpy() as any),
            testFunction: () => { }
        };

        return new TestFixtureBuilder()
            .withFixture(fixtureObject)
            .addTest(test)
            .build();
    }

    @AsyncTest("single setup function called")
    public async singleSetupFunctionCalled() {

        const testFixture = this._createTestFixture();

        const functionKey = "setupFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.SETUP, [ {
            propertyKey: functionKey
        }], testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(testFixture.fixture[functionKey]).toHaveBeenCalled();
    }

    @AsyncTest("single async setup function called")
    public async singleAsyncSetupFunctionCalled() {

        const testFixture = this._createTestFixture();

        const functionKey = "setupFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.SETUP, [ {
            isAsync: true,
            propertyKey: functionKey
        }], testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(testFixture.fixture[functionKey]).toHaveBeenCalled();
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple setup functions called")
    public async multipleSetupFunctionsCalled(setupFunctionCount: number) {

        const testFixture = this._createTestFixture();

        const functionDetails = [];

        for (let i = 0; i < setupFunctionCount; i++) {
            const functionKey = "setupFunction" + i;
            testFixture.fixture[functionKey] = (new FunctionSpy() as any);

            functionDetails.push({
                propertyKey: functionKey
            });
        }

        Reflect.defineMetadata(METADATA_KEYS.SETUP, functionDetails, testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        for (let i = 0; i < setupFunctionCount; i++) {
            Expect(testFixture.fixture["setupFunction" + i]).toHaveBeenCalled();
        }
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple tests setup correct amount of times")
    public async multipleTestsSetupFunctionCalledEachTime(testCount: number) {

        const testFixture = this._createTestFixture();

        while (testFixture.tests.length < testCount) {
            testFixture.tests.push(new TestBuilder()
                                            .withTestCaseCount(1)
                                            .withKey("testFunction" + testFixture.tests.length)
                                            .build()
            );
        }

        const functionKey = "setupFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.SETUP, [ {
            propertyKey: functionKey
        }], testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(testFixture.fixture[functionKey]).toHaveBeenCalled().exactly(testCount).times;
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple test cases setup correct amount of times")
    public async multipleTestCasesSetupFunctionCalledEachTime(testCaseCount: number) {

        const testFixture = this._createTestFixture();

        const test = testFixture.tests[0];

        while (test.testCases.length < testCaseCount) {
            test.testCases.push({
                caseArguments: []
            });
        }

        const functionKey = "setupFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.SETUP, [ {
            propertyKey: functionKey
        }], testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(testFixture.fixture[functionKey]).toHaveBeenCalled().exactly(testCaseCount).times;
    }

    @AsyncTest("single setup fixure function called")
    public async singleSetupFixtureFunctionCalled() {

        const testFixture = this._createTestFixture();

        const functionKey = "setupFixtureFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.SETUP_FIXTURE, [ {
            propertyKey: functionKey
        }], testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(testFixture.fixture[functionKey]).toHaveBeenCalled();
    }

    @AsyncTest("single async setup fixure function called")
    public async singleAsyncSetupFixtureFunctionCalled() {

        const testFixture = this._createTestFixture();

        const functionKey = "setupFixtureFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.SETUP_FIXTURE, [ {
            isAsync: true,
            propertyKey: functionKey
        }], testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(testFixture.fixture[functionKey]).toHaveBeenCalled();
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple setup fixture functions called")
    public async multipleSetupFixtureFunctionsCalled(setupFunctionCount: number) {

        const testFixture = this._createTestFixture();

        const functionDetails = [];

        for (let i = 0; i < setupFunctionCount; i++) {
            const functionKey = "setupFixtureFunction" + i;
            testFixture.fixture[functionKey] = (new FunctionSpy() as any);

            functionDetails.push({
                propertyKey: functionKey
            });
        }

        Reflect.defineMetadata(METADATA_KEYS.SETUP_FIXTURE, functionDetails, testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        for (let i = 0; i < setupFunctionCount; i++) {
            Expect(testFixture.fixture["setupFixtureFunction" + i]).toHaveBeenCalled();
        }
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple tests only setup fixture once")
    public async multipleTestsOnlySetupFixtureOnce(testCount: number) {

        const testFixture = this._createTestFixture();

        while (testFixture.tests.length < testCount) {
            testFixture.tests.push(new TestBuilder()
                                            .withTestCaseCount(1)
                                            .withKey("testFunction" + testFixture.tests.length)
                                            .build()
            );
        }

        const functionKey = "setupFixtureFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.SETUP_FIXTURE, [ {
            propertyKey: functionKey
        }], testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(testFixture.fixture[functionKey]).toHaveBeenCalled().exactly(1).times;
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple test cases only setup fixture once")
    public async multipleTestCasesOnlySetupFixureOnce(testCaseCount: number) {

        const testFixture = this._createTestFixture();

        const test = testFixture.tests[0];

        while (test.testCases.length < testCaseCount) {
            test.testCases.push({
                caseArguments: []
            });
        }

        const functionKey = "setupFixtureFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.SETUP_FIXTURE, [ {
            propertyKey: functionKey
        }], testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(testFixture.fixture[functionKey]).toHaveBeenCalled().exactly(1).times;
    }
}
