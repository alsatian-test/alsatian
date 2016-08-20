import { ITestFixture, ITest } from "./_interfaces";
import { createPromise } from "../promise/create-promise";
import { MatchError, TestSetResults, TestFixtureResults, TestResults, TestSet, TestOutput, METADATA_KEYS, TestTimeoutError } from "./alsatian-core";
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

     const testSetResults = new TestSetResults();
     // TODO: handle these neatly
     let currentTestFixtureResults = testSetResults.addTestFixtureResult(testSet.testFixtures[0]);
     let currentTestResults = currentTestFixtureResults.addTestResult(testSet.testFixtures[0].tests[0]);

     const testPlan: Array<any> = [];

     testSet.testFixtures.forEach(testFixture => {
       testFixture.tests.forEach(test => {
         test.testCases.forEach(testCase => {

           testPlan.push({
             fixture: testFixture.fixture,
             testFixture: testFixture,
             testFunction: testFixture.fixture[test.key],
             test: test,
             arguments: testCase.arguments
           });

         });
       });
     });

     if (testPlan.length === 0) {
       throw new Error("no tests to run.");
     }

     var currentTestPlanItem = testPlan[0];

     var scheduleNextTestPlanItem = (testPlanItem: any) => {
       if (testPlanItem) {
         if (currentTestFixtureResults.fixture !== testPlanItem.testFixture) {
           currentTestFixtureResults = testSetResults.addTestFixtureResult(testPlanItem.testFixture);
         }

         if (currentTestResults.test !== testPlanItem.test) {
           currentTestResults = currentTestFixtureResults.addTestResult(testPlanItem.test);
         }

         setTimeout(() => {
           runTestPlan(testPlanItem);
         });
       }
       else {
         promise.resolve(testPlan);
       }
     };

     var runTestPlan = (test: any) => {

       if (test.test.ignored) {
         let result = currentTestResults.addTestCaseResult(test.arguments);
         this._output.emitResult(testPlan.indexOf(test) + 1, result);
       }

       setup(test.fixture);

       if (!test.isAsync) {
         try {
           test.testFunction.apply(test.fixture, test.arguments);
           let result = currentTestResults.addTestCaseResult(test.arguments);
           this._output.emitResult(testPlan.indexOf(test) + 1, result);

         }
         catch (error) {
            let result = currentTestResults.addTestCaseResult(test.arguments, error);
            this._output.emitResult(testPlan.indexOf(test) + 1, result);
         }
         tearDown(test.fixture);

         const nextTestPlanIndex = testPlan.indexOf(test) + 1;
         scheduleNextTestPlanItem(testPlan[nextTestPlanIndex]);
       }
       else {
         let timeout = false;

         let promise: any = test.fixture[test.key].apply(test.fixture, test.arguments);
         let timeoutCheck: number = null;

        promise.then(() => {

           if (!timeout) {
             clearTimeout(timeoutCheck);
             let result = currentTestResults.addTestCaseResult(test.arguments);
             this._output.emitResult(testPlan.indexOf(test) + 1, result);
           }
         })
         .catch((error: Error) => {
             let result = currentTestResults.addTestCaseResult(test.arguments, error);
             this._output.emitResult(testPlan.indexOf(test) + 1, result);
         });

         timeoutCheck = setTimeout(() => {

           timeout = true;
           let error = new TestTimeoutError(test.timeout || timeout);

            let result = currentTestResults.addTestCaseResult(test.arguments, error);
            this._output.emitResult(testPlan.indexOf(test) + 1, result);
        }, test.timeout || timeout);
       }
     }

     var tearDown = (testFixture: { [id: string ]: () => any }) => {
       let teardownFunctions: Array<string> = Reflect.getMetadata(METADATA_KEYS.TEARDOWN, testFixture);

       if (teardownFunctions) {
         teardownFunctions.forEach(teardownFunction => {
             testFixture[teardownFunction].call(testFixture);
         });
       }
     }

     var setup = (testFixture: { [id: string ]: () => any }) => {
       let setupFunctions: Array<string> = Reflect.getMetadata(METADATA_KEYS.SETUP, testFixture);

       if (setupFunctions) {
         setupFunctions.forEach(setupFunction => {
             testFixture[setupFunction].call(testFixture);
         });
       }
     }

     this._output.emitVersion();
     this._output.emitPlan(testPlan.length);

     scheduleNextTestPlanItem(testPlan[0]);

     return promise;


   }
}
