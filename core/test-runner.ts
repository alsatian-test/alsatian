import { ITestFixture, ITest } from "./_interfaces";
import { createPromise } from "../promise/create-promise";
import { MatchError, TestSetResults, TestFixtureResults, TestResults, TestSet, TestOutput, METADATA_KEYS, TestTimeoutError } from "./alsatian-core";
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
   private _output: TestOutput;

   constructor (output?: TestOutput) {
       // If we were given a TestOutput, use it, otherwise make one
       if (output !== undefined) {
           this._output = output;
       } else {
           this._output = new TestOutput(process.stdout);
       }
   }

   private _testTimeout: number = 500;

   public run(testSet: TestSet, timeout?: number) {

      if (timeout) {
         this._testTimeout = timeout;
      }

     let anyTestsFocussed = testSet.testFixtures.filter(testFixture => testFixture.focussed || testFixture.getTests().filter(test => test.focussed).length > 0).length > 0;

     this._testFixtures = testSet.testFixtures;

     // Filter out unfocussed tests if any are focussed
     if (anyTestsFocussed) {
       this._testFixtures = testSet.testFixtures.filter(testFixture => testFixture.focussed || testFixture.getTests().filter(test => test.focussed).length > 0);
     }

      let totalTestCount = this._testFixtures
                                   .filter(x => x.getTests().length > 0)
                                   .map(x => x.getTests().map((y: any) => y.testCases.length)
                                   .reduce((a: number, b: number) => a + b, 0))
                                   .reduce((a: number, b: number) => a + b, 0);

      if (totalTestCount === 0) {
        throw new Error("no tests to run.");
      }
      else {

          this._output.emitVersion();
          this._output.emitPlan(totalTestCount);

          this._output.emitFixture(this._testFixtures[this._currentTestFixtureIndex]);

         this._currentTestFixtureResults = this._testResults.addTestFixtureResult(this._testFixtures[this._currentTestFixtureIndex]);
         this._currentTestResults = this._currentTestFixtureResults.addTestResult(this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex]);

         setTimeout(() => {
         this._runTest(this._testFixtures[this._currentTestFixtureIndex],
                 this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex],
                 this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments);
              });
      }

      return this._resultPromise;
   }

   private _runTest(testFixture: ITestFixture, test: ITest, testCaseArguments: Array<any>) {
     this._currentTestId++;

     if (test.ignored) {
         let result = this._currentTestResults.addTestCaseResult(testCaseArguments, undefined);
         this._output.emitResult(this._currentTestId, result);
         this._runNextTest();
         return;
     }

     let setupFunctions: Array<string> = Reflect.getMetadata(METADATA_KEYS.SETUP, testFixture.fixture);

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

     let result = this._currentTestResults.addTestCaseResult(testCaseArguments, error);
     this._output.emitResult(this._currentTestId, result);

     this._runNextTestCase();
   }

   private _notifySuccess(test: ITest, testCaseArguments: Array<any>) {
     this._teardown();

     let result = this._currentTestResults.addTestCaseResult(testCaseArguments);
     this._output.emitResult(this._currentTestId, result);

     this._runNextTestCase();
   }

   private _teardown() {
     let testFixture = this._testFixtures[this._currentTestFixtureIndex];

     let teardownFunctions: Array<string> = Reflect.getMetadata(METADATA_KEYS.TEARDOWN, testFixture.fixture);

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
     else if (!this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex]) {
       this._runNextTestFixture();
     }
     else {
        this._currentTestFixtureResults = this._testResults.addTestFixtureResult(this._testFixtures[this._currentTestFixtureIndex]);

        this._output.emitFixture(this._testFixtures[this._currentTestFixtureIndex]);

        setTimeout(() => {
          this._runTest(this._testFixtures[this._currentTestFixtureIndex],
                  this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex],
                  this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments);
        });
     }
   }

   private _runNextTest() {
     this._currentTestIndex++;
     this._currentTestCaseIndex = 0;

     if (!this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex]) {
       this._runNextTestFixture();
     }
     else {
        this._currentTestResults = this._currentTestFixtureResults.addTestResult(this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex]);

       this._runTest(this._testFixtures[this._currentTestFixtureIndex],
               this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex],
               this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments);
     }
   }

   private _runNextTestCase = () => {
     this._currentTestCaseIndex++;

     if (!this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex].testCases[this._currentTestCaseIndex]) {
       this._runNextTest();
     }
     else {
       this._runTest(this._testFixtures[this._currentTestFixtureIndex],
               this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex],
               this._testFixtures[this._currentTestFixtureIndex].getTests()[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments);
     }
   }
}
