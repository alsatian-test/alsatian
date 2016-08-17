import { MatchError } from "./_errors";
import { TestSet } from "./_core";
import { ITestFixture } from "./_interfaces/test-fixture.i";
import { ITest } from "./_interfaces/test.i";
import { createPromise } from "../promise/create-promise";
import { TestSetResults, TestFixtureResults, TestResults } from "./_results";
import { TestTimeoutError } from "./_errors";
import "reflect-metadata";

export class TestRunner {

   private _testsFocussed: boolean;
   private _testFixtures: Array<ITestFixture>;
   private _currentTestId: number = 0;
   private _currentTestFixtureIndex: number = 0;
   private _currentTestIndex: number = 0;
   private _currentTestCaseIndex: number = 0;
   private _resultPromise: any = createPromise();
   private _testResults = new TestSetResults();
   private _currentTestResults: TestResults;
   private _currentTestFixtureResults: TestFixtureResults;
   private _testTimeout: number = 500;

   public run(testSet: TestSet, timeout?: number) {

      if (timeout) {
         this._testTimeout = timeout;
      }

     let anyTestsFocussed = testSet.testFixtures.filter(testFixture => testFixture.focussed || testFixture.tests.filter(test => test.focussed).length > 0).length > 0;

     this._testFixtures = testSet.testFixtures;

     // Filter out unfocussed tests if any are focussed
     if (anyTestsFocussed) {
       this._testFixtures = testSet.testFixtures.filter(testFixture => testFixture.focussed || testFixture.tests.filter(test => test.focussed).length > 0);
     }

      let totalTestCount = this._testFixtures
                                   .filter(x => x.tests.length > 0)
                                   .map(x => x.tests.map((y: any) => y.testCases.length)
                                   .reduce((a: number, b: number) => a + b, 0))
                                   .reduce((a: number, b: number) => a + b, 0);

      if (totalTestCount === 0) {
        throw new Error("no tests to run.");
      }
      else {

         process.stdout.write("TAP version 13\n");
         process.stdout.write(`1..${totalTestCount}\n`);

         this._currentTestFixtureResults = this._testResults.addTestFixtureResult(this._testFixtures[this._currentTestFixtureIndex]);
         this._currentTestResults = this._currentTestFixtureResults.addTestResult(this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex]);

         setTimeout(() => {
         this._runTest(this._testFixtures[this._currentTestFixtureIndex],
                 this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
                 this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments);
              });
      }

      return this._resultPromise;
   }

   private _runTest(testFixture: ITestFixture, test: ITest, testCaseArguments: Array<any>) {
     this._currentTestId++;

     if (test.ignored) {
       process.stdout.write(`ok ${this._getTestDescription(test, testCaseArguments)}\n`);
       this._runNextTest();
       return;
     }

     let setupFunctions: Array<string> = Reflect.getMetadata("alsatian:setup", testFixture.fixture);

     if (setupFunctions) {
       setupFunctions.forEach(setupFunction => {
           testFixture.fixture[setupFunction].call(testFixture.fixture);
       });
     }

     try {
        if (test.isAsync) {
           let timeout = false;

           let promise: any = testFixture.fixture[test.key].apply(testFixture.fixture, testCaseArguments);
           let timeoutCheck: NodeJS.Timer = null;

          promise.then(() => {

             if (!timeout) {
               this._notifySuccess(test, testCaseArguments);
               clearTimeout(timeoutCheck);
             }
           })
           .catch((error: Error) => {
             this._handleError(error, test, testCaseArguments);
           });

           timeoutCheck = setTimeout(() => {

             timeout = true;
             this._handleError(new TestTimeoutError(test.timeout || this._testTimeout), test, testCaseArguments);
          }, test.timeout || this._testTimeout);
        }
        else {
          testFixture.fixture[test.key].apply(testFixture, testCaseArguments);
          this._notifySuccess(test, testCaseArguments);
        }
     }
     catch (error) {
       this._handleError(error, test, testCaseArguments);
     }
   }

   private _handleError(error: Error, test: ITest, testCaseArguments: Array<any>) {

     this._teardown();

     this._currentTestResults.addTestCaseResult(testCaseArguments, error);
     process.stdout.write(`not ok ${this._getTestDescription(test, testCaseArguments)}\n`);

     if (error instanceof MatchError) {
       process.stdout.write(` ---\n   message: "${error.message}"\n   severity: fail\n   data:\n     got: ${JSON.stringify(error.actualValue)}\n     expect: ${JSON.stringify(error.expectedValue)}\n ...\n`);
     }
     else {
        console.log(error);
       process.stdout.write("# Unknown Error\n");
     }

     this._runNextTestCase();
   }

   private _notifySuccess(test: ITest, testCaseArguments: Array<any>) {
     this._teardown();
     process.stdout.write(`ok ${this._getTestDescription(test, testCaseArguments)}\n`);

     this._currentTestResults.addTestCaseResult(testCaseArguments);

     this._runNextTestCase();
   }

   private _getTestDescription = (test: ITest, testCaseArguments: Array<any>) => {
     let testDescription = `${this._currentTestId} ${test.ignored ? "# skip " : ""}${test.description}`;

     if (testCaseArguments !== undefined) {
       testDescription += ` [ ${testCaseArguments.map(x => JSON.stringify(x) || "undefined").join(", ")} ]`;
     }

     return testDescription;
   }

   private _teardown() {
     let testFixture = this._testFixtures[this._currentTestFixtureIndex];

     let teardownFunctions: Array<string> = Reflect.getMetadata("alsatian:teardown", testFixture.fixture);

     if (teardownFunctions) {
       teardownFunctions.forEach(teardownFunction => {
           testFixture.fixture[teardownFunction].call(testFixture.fixture);
       });
     }
   }

   private _exit() {
     this._resultPromise.resolve(this._testResults);
   }

   private _runNextTestFixture() {
     this._currentTestFixtureIndex++;
     this._currentTestIndex = 0;
     this._currentTestCaseIndex = 0;

     // no more test fixtures
     if (!this._testFixtures[this._currentTestFixtureIndex]) {
       this._exit();
     }
     // no tests on this fixture
     else if (!this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex]) {
       this._runNextTestFixture();
     }
     else {
        this._currentTestFixtureResults = this._testResults.addTestFixtureResult(this._testFixtures[this._currentTestFixtureIndex]);

        setTimeout(() => {
          this._runTest(this._testFixtures[this._currentTestFixtureIndex],
                  this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
                  this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments);
        });
     }
   }

   private _runNextTest() {
     this._currentTestIndex++;
     this._currentTestCaseIndex = 0;

     if (!this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex]) {
       this._runNextTestFixture();
     }
     else {
        this._currentTestResults = this._currentTestFixtureResults.addTestResult(this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex]);

       this._runTest(this._testFixtures[this._currentTestFixtureIndex],
               this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
               this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments);
     }
   }

   private _runNextTestCase = () => {
     this._currentTestCaseIndex++;

     if (!this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex]) {
       this._runNextTest();
     }
     else {
       this._runTest(this._testFixtures[this._currentTestFixtureIndex],
               this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
               this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments);
     }
   }
}
