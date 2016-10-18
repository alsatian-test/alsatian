import { ITestFixture, ITest } from "../_interfaces";
import { Promise } from "../../promise/promise";
import { MatchError, TestSetResults, TestFixtureResults, TestResults, TestSet, TestOutputStream, TestTimeoutError } from "../alsatian-core";
import { TestPlan } from "./test-plan";
import { TestItem } from "./test-item";
import { TestSetRunInfo } from "./test-set-run-info";
import "reflect-metadata";

export class TestRunner {

   private _outputStream: TestOutputStream;
   public get outputStream() {
      return this._outputStream;
   }

   constructor (outputStream?: TestOutputStream) {
      // If we were given a TestOutput, use it, otherwise make one
      if (outputStream !== undefined) {
         this._outputStream = outputStream;
      } else {
         this._outputStream = new TestOutputStream();
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

      this._outputStream.emitVersion();
      this._outputStream.emitPlan(testPlan.testItems.length);

      return new Promise<TestSetResults>((resolve, reject) => {

         const testSetRunInfo = new TestSetRunInfo(
            testPlan,
            testSetResults,
            timeout);

            this._scheduleNextTestPlanItem(testSetRunInfo, resolve);
         });
      }

      private _createResultAndRunNextTest(testSetRunInfo: TestSetRunInfo, resolve: (testSetResults: TestSetResults) => any, error?: Error) {

         const testSetResults = testSetRunInfo.testSetResults;

         const currentTestFixtureResults = testSetResults
         .testFixtureResults[testSetResults.testFixtureResults.length - 1];

         const currentTestResults = currentTestFixtureResults
         .testResults[currentTestFixtureResults.testResults.length - 1];

         const testItem = testSetRunInfo.testPlanItem;

         let result = currentTestResults.addTestCaseResult(testItem.testCase.arguments, error);
         this._outputStream.emitResult(testSetRunInfo.testPlan.testItems.indexOf(testItem) + 1, result);
         this._scheduleNextTestPlanItem(testSetRunInfo, resolve);
      }

      private _scheduleNextTestPlanItem(testSetRunInfo: TestSetRunInfo,  resolve: (testSetResults: TestSetResults) => any) {

         const nextTestPlanIndex = testSetRunInfo.testPlan.testItems.indexOf(testSetRunInfo.testPlanItem) + 1;
         const nextTestPlanItem = testSetRunInfo.testPlan.testItems[nextTestPlanIndex];

         if (nextTestPlanItem) {

            testSetRunInfo.testPlanItem = nextTestPlanItem;

            const testSetResults = testSetRunInfo.testSetResults;

            let currentTestFixtureResults = testSetResults
            .testFixtureResults[testSetResults.testFixtureResults.length - 1];

            if (!currentTestFixtureResults || currentTestFixtureResults.fixture !== nextTestPlanItem.testFixture) {
               this._outputStream.emitFixture(nextTestPlanItem.testFixture);
               currentTestFixtureResults = testSetResults.addTestFixtureResult(nextTestPlanItem.testFixture);
            }

            let currentTestResults = currentTestFixtureResults
            .testResults[currentTestFixtureResults.testResults.length - 1];

            if (!currentTestResults || currentTestResults.test !== nextTestPlanItem.test) {
               currentTestResults = currentTestFixtureResults.addTestResult(nextTestPlanItem.test);
            }

            nextTestPlanItem.run(testSetRunInfo.timeout)
            .then((testResults: { test: ITest, error: Error }) => {
               this._createResultAndRunNextTest(testSetRunInfo, resolve, testResults.error);
            })
            .catch((error: Error) => {
               this._createResultAndRunNextTest(testSetRunInfo, resolve, error);
            });
         }
         else {
            resolve(testSetRunInfo.testSetResults);
            this._outputStream.end();
         }
      };
   }
