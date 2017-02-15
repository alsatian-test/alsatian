import "reflect-metadata";
import { ITest, ITestFixture } from "../_interfaces";
import { MatchError,
         METADATA_KEYS,
         TestCaseResult,
         TestFixtureResults,
         TestOutputStream,
         TestResults,
         TestSet,
         TestSetResults,
         TestTimeoutError } from "../alsatian-core";
import { ISetupTeardownMetadata } from "../decorators/_interfaces";
import { IOnTestCompleteCBFunction, ITestCompleteEvent } from "../events";
import { TestItem } from "./test-item";
import { TestPlan } from "./test-plan";
import { TestSetRunInfo } from "./test-set-run-info";

export class TestRunner {
    private _onTestCompleteCBs: Array<IOnTestCompleteCBFunction> = [];
    private _outputStream: TestOutputStream;
    public get outputStream() {
        return this._outputStream;
    }

    constructor(outputStream?: TestOutputStream) {
        // If we were given a TestOutput, use it, otherwise make one
        if (outputStream !== undefined) {
            this._outputStream = outputStream;
        } else {
            this._outputStream = new TestOutputStream();
        }
    }

    public async run(testSet: TestSet, timeout?: number) {

        const testPlan = new TestPlan(testSet);
        if (testPlan.testItems.length === 0) {
            throw new Error("no tests to run.");
        }

        if (!timeout) {
            timeout = 500;
        }

        const testSetResults = new TestSetResults();

        this._outputStream.emitVersion();
        this._outputStream.emitPlan(testPlan.testItems.length);

        const testSetRunInfo = new TestSetRunInfo(
            testPlan,
            testSetResults,
            timeout);

        await this._runTests(testSetRunInfo, testSetResults);
    }

    /**
     * Defined the call back function to be called when the test is completed
     */
    public onTestComplete(testCompleteCB: IOnTestCompleteCBFunction) {
        this._onTestCompleteCBs.push(testCompleteCB);
    }

    private async _runTests(testSetRunInfo: TestSetRunInfo, results: TestSetResults) {
        let currentTestFixtureResults: TestFixtureResults;
        let currentTestResults: TestResults;
        let errorOccurredRunningTest: Error;

        for (const testItem of testSetRunInfo.testPlan.testItems) {

            const testItemIndex = testSetRunInfo.testPlan.testItems.indexOf(testItem);
            const previousTestItem = testSetRunInfo.testPlan.testItems[testItemIndex - 1];

            // if new fixture
            if (!previousTestItem || previousTestItem.testFixture !== testItem.testFixture) {

                if (previousTestItem) {
                    await this._teardownFixture(previousTestItem.testFixture.fixture);
                }

                await this._setupFixture(testItem.testFixture.fixture);

                this._outputStream.emitFixture(testItem.testFixture);
                currentTestFixtureResults = results.addTestFixtureResult(testItem.testFixture);
            }

            // if new test
            if (!previousTestItem || previousTestItem.test !== testItem.test) {
                currentTestResults = currentTestFixtureResults.addTestResult(testItem.test);
            }

            let result: TestCaseResult;

            try {
                await testItem.run(testSetRunInfo.timeout);
                result = currentTestResults.addTestCaseResult(testItem.testCase.caseArguments);
                errorOccurredRunningTest = null;
            }
            catch (error) {
                result = currentTestResults.addTestCaseResult(testItem.testCase.caseArguments, error);
                errorOccurredRunningTest = error;
            }

            // emit onComplete event out of Alsatian if call back has been defined
            if (this._onTestCompleteCBs) {
                this._onTestCompleteCBs.forEach(onTestCompleteCB => {
                   onTestCompleteCB({
                        error: errorOccurredRunningTest,
                        outcome: result.outcome,
                        test: testItem.test,
                        testCase: testItem.testCase,
                        testFixture: testItem.testFixture,
                        testId: testSetRunInfo.testPlan.testItems.indexOf(testItem) + 1
                    });
                });
            }

            this._outputStream.emitResult(testItemIndex + 1, result);
        }

        // teardown the last test fixture
        const lastTestItem = testSetRunInfo.testPlan.testItems[testSetRunInfo.testPlan.testItems.length - 1];
        await this._teardownFixture(lastTestItem.testFixture.fixture);

        this._outputStream.end();
    }

    private async _setupFixture(fixture: { [key: string]: Function }) {
        await this._runFixtureFunctions(fixture, METADATA_KEYS.SETUP_FIXTURE);
    }

    private async _teardownFixture(fixture: { [key: string]: Function }) {
        await this._runFixtureFunctions(fixture, METADATA_KEYS.TEARDOWN_FIXTURE);
    }

    private async _runFixtureFunctions(fixture: { [key: string]: Function }, metadataKey: string) {

        const fixtureFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(
                                                                        metadataKey,
                                                                        fixture);

        if (fixtureFunctions) {
            for (const fixtureFunction of fixtureFunctions) {
                if (fixtureFunction.isAsync) {
                    await fixture[fixtureFunction.propertyKey].call(fixture);
                }
                else {
                    fixture[fixtureFunction.propertyKey].call(fixture);
                }
            }
        }
    }
}
