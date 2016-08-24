import { ITestFixture, ITest } from "../_interfaces";
import { createPromise } from "../../promise/create-promise";
import { MatchError, TestSetResults, TestFixtureResults, TestResults, TestSet, TestOutput, TestTimeoutError } from "../alsatian-core";
import { TestPlan } from "./test-plan";
import { TestItem } from "./test-item";
import { TestSetRunInfo } from "./test-set-run-info";
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

      const testPlan = new TestPlan(testSet);
      if (testPlan.testItems.length === 0) {
         throw new Error("no tests to run.");
      }

      if (!timeout) {
         timeout = 500;
      }

      const testSetResults = new TestSetResults();

      this._output.emitVersion();
      this._output.emitPlan(testPlan.testItems.length);

      const promise = createPromise();

      const testSetRunInfo = new TestSetRunInfo(promise,
         testPlan,
         testSetResults,
         timeout);

         this._scheduleNextTestPlanItem(testSetRunInfo);

      return promise;
   }

   private _createResultAndRunNextTest(testSetRunInfo: TestSetRunInfo, error?: Error) {

      const testSetResults = testSetRunInfo.testSetResults;

      const currentTestFixtureResults = testSetResults
      .testFixtureResults[testSetResults.testFixtureResults.length - 1];

      const currentTestResults = currentTestFixtureResults
      .testResults[currentTestFixtureResults.testResults.length - 1];

      const testItem = testSetRunInfo.testPlanItem;

      let result = currentTestResults.addTestCaseResult(testItem.testCase.arguments, error);
      this._output.emitResult(testSetRunInfo.testPlan.testItems.indexOf(testItem) + 1, result);
      this._scheduleNextTestPlanItem(testSetRunInfo);
   }

   private _scheduleNextTestPlanItem(testSetRunInfo: TestSetRunInfo) {

      const nextTestPlanIndex = testSetRunInfo.testPlan.testItems.indexOf(testSetRunInfo.testPlanItem) + 1;
      const nextTestPlanItem = testSetRunInfo.testPlan.testItems[nextTestPlanIndex];

      if (nextTestPlanItem) {

         testSetRunInfo.testPlanItem = nextTestPlanItem;

         const testSetResults = testSetRunInfo.testSetResults;

         let currentTestFixtureResults = testSetResults
         .testFixtureResults[testSetResults.testFixtureResults.length - 1];

         if (!currentTestFixtureResults || currentTestFixtureResults.fixture !== nextTestPlanItem.testFixture) {
            this._output.emitFixture(nextTestPlanItem.testFixture);
            currentTestFixtureResults = testSetResults.addTestFixtureResult(nextTestPlanItem.testFixture);
         }

         let currentTestResults = currentTestFixtureResults
         .testResults[currentTestFixtureResults.testResults.length - 1];

         if (!currentTestResults || currentTestResults.test !== nextTestPlanItem.test) {
            currentTestResults = currentTestFixtureResults.addTestResult(nextTestPlanItem.test);
         }

         nextTestPlanItem.run(testSetRunInfo.timeout)
         .then((testResults: { test: ITest, error: Error }) => {
            this._createResultAndRunNextTest(testSetRunInfo, testResults.error);
         })
         .catch((error: Error) => {
            console.log(error);
         });
      }
      else {
         testSetRunInfo.promise.resolve(testSetRunInfo.testSetResults);
      }
   };
}
