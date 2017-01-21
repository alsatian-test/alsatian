import "reflect-metadata";
import { ITest, ITestFixture } from "../_interfaces";
import { ITestCompleteEvent, IOnTestCompleteCBFunction } from "../events";
import { MatchError,
         TestCaseResult,
         TestFixtureResults,
         TestOutputStream,
         TestResults,
         TestSet,
         TestSetResults,
         TestTimeoutError } from "../alsatian-core";
import { TestItem } from "./test-item";
import { TestPlan } from "./test-plan";
import { TestSetRunInfo } from "./test-set-run-info";

export class TestRunner {
    private _onTestCompleteCBs: IOnTestCompleteCBFunction[] = [];
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
                result = currentTestResults.addTestCaseResult(testItem.testCase.arguments);
                errorOccurredRunningTest = null;
            }
            catch (error) {
                result = currentTestResults.addTestCaseResult(testItem.testCase.arguments, error);
                errorOccurredRunningTest = error;
            }

            // emit onComplete event out of Alsatian if call back has been defined
            if (this._onTestCompleteCBs) {
                this._onTestCompleteCBs.forEach(onTestCompleteCB => {
                   onTestCompleteCB({
                        testId: testSetRunInfo.testPlan.testItems.indexOf(testItem) + 1,
                        test: testItem.test,
                        testFixture: testItem.testFixture,
                        outcome: result.outcome,
                        testCase: testItem.testCase,
                        error: errorOccurredRunningTest
                    });
                });
            }

            this._outputStream.emitResult(testItemIndex + 1, result);
        }

        this._outputStream.end();
    }
}
