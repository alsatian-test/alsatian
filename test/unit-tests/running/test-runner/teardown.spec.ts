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

@TestFixture("tearing down tests")
export class TeardownTests {

    private _createTestFixture() {
        const test = new TestBuilder()
            .withTestCaseCount(1)
            .withKey("testFunction")
            .build();

        const fixtureObject = {
            teardownFunction: (new FunctionSpy() as any),
            testFunction: () => { }
        };

        return new TestFixtureBuilder()
            .withFixture(fixtureObject)
            .addTest(test)
            .build();
    }

    @AsyncTest("single teardown function called")
    public async singleTeardownFunctionCalled() {

        const testFixture = this._createTestFixture();

        const functionKey = "teardownFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.TEARDOWN, [ {
            propertyKey: "teardownFunction"
        }], testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(testFixture.fixture["teardownFunction"]).toHaveBeenCalled();
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple teardown functions called")
    public async multipleTeardownFunctionsCalled(teardownFunctionCount: number) {        

        const testFixture = this._createTestFixture();

        const functionDetails = [];

        for (let i = 0; i < teardownFunctionCount; i++) {
            const functionKey = "teardownFunction" + i;
            testFixture.fixture[functionKey] = (new FunctionSpy() as any);

            functionDetails.push({
                propertyKey: functionKey
            });
        }

        Reflect.defineMetadata(METADATA_KEYS.TEARDOWN, functionDetails, testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        for (let i = 0; i < teardownFunctionCount; i++) {
            Expect(testFixture.fixture["teardownFunction" + i]).toHaveBeenCalled();
        }
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple tests teardown correct amount of times")
    public async multipleTestsTeardownFunctionCalledEachTime(testCount: number) {        

        const testFixture = this._createTestFixture();
        
        while (testFixture.tests.length < testCount) {
            testFixture.tests.push(new TestBuilder()
                                            .withTestCaseCount(1)
                                            .withKey("testFunction" + testFixture.tests.length)
                                            .build()
            );
        }

        const functionKey = "teardownFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.TEARDOWN, [ {
            propertyKey: "teardownFunction"
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
    @AsyncTest("multiple test cases teardown correct amount of times")
    public async multipleTestCasesTeardownFunctionCalledEachTime(testCaseCount: number) {        

        const testFixture = this._createTestFixture();

        const test = testFixture.tests[0];
        
        while (test.testCases.length < testCaseCount) {
            test.testCases.push({
                arguments: []
            });
        }

        const functionKey = "teardownFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.TEARDOWN, [ {
            propertyKey: "teardownFunction"
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

    @AsyncTest("single teardown fixure function called")
    public async singleTeardownFixtureFunctionCalled() {

        const testFixture = this._createTestFixture();

        const functionKey = "teardownFixtureFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.TEARDOWN_FIXTURE, [ {
            propertyKey: "teardownFixtureFunction"
        }], testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        Expect(testFixture.fixture["teardownFixtureFunction"]).toHaveBeenCalled();
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple teardown fixture functions called")
    public async multipleTeardownFixtureFunctionsCalled(teardownFunctionCount: number) {        

        const testFixture = this._createTestFixture();

        const functionDetails = [];

        for (let i = 0; i < teardownFunctionCount; i++) {
            const functionKey = "teardownFixtureFunction" + i;
            testFixture.fixture[functionKey] = (new FunctionSpy() as any);

            functionDetails.push({
                propertyKey: functionKey
            });
        }

        Reflect.defineMetadata(METADATA_KEYS.TEARDOWN_FIXTURE, functionDetails, testFixture.fixture);

        const testSet = new TestSetBuilder()
            .addTestFixture(testFixture)
            .build();

        const outputStream = new TestOutputStream();
        SpyOn(outputStream, "push");

        const runner = new TestRunner(outputStream);

        await runner.run(testSet);

        for (let i = 0; i < teardownFunctionCount; i++) {
            Expect(testFixture.fixture["teardownFixtureFunction" + i]).toHaveBeenCalled();
        }
    }

    @TestCase(2)
    @TestCase(5)
    @AsyncTest("multiple tests only teardown fixture once")
    public async multipleTestsOnlyTeardownFixtureOnce(testCount: number) {        

        const testFixture = this._createTestFixture();
        
        while (testFixture.tests.length < testCount) {
            testFixture.tests.push(new TestBuilder()
                                            .withTestCaseCount(1)
                                            .withKey("testFunction" + testFixture.tests.length)
                                            .build()
            );
        }

        const functionKey = "teardownFixtureFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.TEARDOWN_FIXTURE, [ {
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
    @AsyncTest("multiple test cases only teardown fixture once")
    public async multipleTestCasesOnlyTeardownFixureOnce(testCaseCount: number) {        

        const testFixture = this._createTestFixture();

        const test = testFixture.tests[0];
        
        while (test.testCases.length < testCaseCount) {
            test.testCases.push({
                arguments: []
            });
        }

        const functionKey = "teardownFixtureFunction";
        testFixture.fixture[functionKey] = (new FunctionSpy() as any);

        Reflect.defineMetadata(METADATA_KEYS.TEARDOWN_FIXTURE, [ {
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