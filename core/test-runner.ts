import { ITestFixture, ITest } from "./_interfaces";
import { createPromise } from "../promise/create-promise";
import { MatchError, TestSetResults, TestFixtureResults, TestResults, TestSet, TestOutput, TestTimeoutError } from "./alsatian-core";
import { TestPlan } from "./test-plan";
import { TestItem } from "./test-item";
import "reflect-metadata";

export class TestRunner {

   private _output: TestOutput;

   constructor (output?: TestOutput) {
       // If we were given a TestOutput, use it, otherwise make one
       if (output !== undefined) {
           this._output = output;
       } else {
           this._output = new TestOutput(process.stdout);
       }
   }

   public run(testSet: TestSet, timeout?: number) {

     let promise = createPromise();

     if (!timeout) {
        timeout = 500;
     }

     const testPlan = new TestPlan(testSet);

     if (testPlan.testItems.length === 0) {
       throw new Error("no tests to run.");
     }

     const testSetResults = new TestSetResults();
     // TODO: handle these neatly
     let currentTestFixtureResults = testSetResults.addTestFixtureResult(testSet.testFixtures[0]);
     let currentTestResults = currentTestFixtureResults.addTestResult(testSet.testFixtures[0].tests[0]);

     this._output.emitVersion();
     this._output.emitPlan(testPlan.testItems.length);

     this._scheduleNextTestPlanItem(promise,
                                    testPlan,
                                    testSetResults,
                                    timeout,
                                    testPlan.testItems[0]);

     return promise;
   }

   private _createResultAndRunNextTest(
                                        promise: any,
                                        testPlan: TestPlan,
                                        testSetResults: TestSetResults,
                                        timeout: number,
                                        testItem: TestItem,
                                        error?: Error) {

     const currentTestFixtureResults = testSetResults
                .testFixtureResults[testSetResults.testFixtureResults.length - 1];

     const currentTestResults = currentTestFixtureResults
                .testResults[currentTestFixtureResults.testResults.length - 1];

     let result = currentTestResults.addTestCaseResult(testItem.testCase.arguments, error);
     this._output.emitResult(testPlan.testItems.indexOf(testItem) + 1, result);

     const nextTestPlanIndex = testPlan.testItems.indexOf(testItem) + 1;
     this._scheduleNextTestPlanItem(promise,
                                    testPlan,
                                    testSetResults,
                                    timeout,
                                    testPlan.testItems[nextTestPlanIndex]);
   }

   private _scheduleNextTestPlanItem(
                                      promise: any,
                                      testPlan: TestPlan,
                                      testSetResults: TestSetResults,
                                      timeout: number,
                                      testPlanItem: TestItem) {

     if (testPlanItem) {

        let currentTestFixtureResults = testSetResults
                   .testFixtureResults[testSetResults.testFixtureResults.length - 1];

       let currentTestResults = currentTestFixtureResults
                  .testResults[currentTestFixtureResults.testResults.length - 1];

       if (currentTestFixtureResults.fixture !== testPlanItem.testFixture) {
         currentTestFixtureResults = testSetResults.addTestFixtureResult(testPlanItem.testFixture);
       }

       if (currentTestResults.test !== testPlanItem.test) {
         currentTestResults = currentTestFixtureResults.addTestResult(testPlanItem.test);
       }

       testPlanItem.run(timeout)
       .then((testResults: { test: ITest, error: Error }) => {
         this._createResultAndRunNextTest(promise, testPlan, testSetResults, timeout, testPlanItem, testResults.error);
       })
       .catch((error: Error) => {
         console.log(error);
       });
     }
     else {
       promise.resolve(testSetResults);
     }
   };
}
