import { MatchError } from "./errors/match-error";
import { TestSet } from "./test-set";
import "reflect-metadata";

export class TestRunner {

   private _testsFocussed: boolean;
   private _currentTestSet: TestSet;
   private _currentTestId: number = 0;
   private _currentTestFixtureIndex: number = 0;
   private _currentTestIndex: number = 0;
   private _currentTestCaseIndex: number = 0;
   private _testsFailed: boolean = false;

   public run(testSet: TestSet) {

     this._currentTestSet = testSet;

      if (this._currentTestSet.testFixtures.length === 0) {
        process.stderr.write("no tests to run\n");
        process.exit(1);
      }
      else {

         let totalTestCount = this._currentTestSet.testFixtures.map(x => x.tests.map((y: any) => y.testCases.length).reduce((a: number, b: number) => a + b)).reduce((a: number, b: number) => a + b);
         process.stdout.write("TAP version 13\n");
         process.stdout.write(`1..${totalTestCount}\n`);

         this._runTest(this._currentTestSet.testFixtures[this._currentTestFixtureIndex],
                 this._currentTestSet.testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
                 this._currentTestSet.testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments);
      }
   }

   private _runTest(testFixture: any, test: any, testCaseArguments: Array<any>) {

     this._currentTestId++;

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
           promise.then(() => {
             // TODO: Cancel promise on timeout instead;
             if (!timeout) {
               this._notifySuccess(test, testCaseArguments);
             }
           })
           .catch((error: Error) => {
             this._handleError(error, test, testCaseArguments);
           });

           let timeoutCheck = setTimeout(() => {
             // TODO: Cancel promise on timeout instead;
             timeout = true;
             this._handleError(new /*MatchError("longer than 500ms", "less than 500ms",*/Error("The test exceeded the given timeout."), test, testCaseArguments);
           }, 500);
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

   private _handleError(error: Error, test: any, testCaseArguments: Array<any>) {
      this._testsFailed = true;
     process.stdout.write(`not ok ${this._getTestDescription(test, testCaseArguments)}\n`);
     if (error instanceof MatchError) {
       process.stdout.write(` ---\n   message: "${error.message}"\n   severity: fail\n   data:\n     got: ${JSON.stringify(error.actualValue)}\n     expect: ${JSON.stringify(error.expectedValue)}\n ...\n`);
     }
     else {
        console.log(error);
       process.stdout.write("# Unknown Error\n");
     }

     this._teardown();
   }

   private _notifySuccess(test: any, testCaseArguments: Array<any>) {
     process.stdout.write(`ok ${this._getTestDescription(test, testCaseArguments)}\n`);
     this._teardown();
   }

   private _getTestDescription = (test: any, testCaseArguments: Array<any>) => {
     let testDescription = `${this._currentTestId} - ${test.description}`;

     if (testCaseArguments !== undefined) {
       testDescription += ` [ ${testCaseArguments.map(x => JSON.stringify(x) || "undefined").join(", ")} ]`;
     }

     return testDescription;
   }

   private _teardown() {
     let testFixture = this._currentTestSet.testFixtures[this._currentTestFixtureIndex];

     let teardownFunctions: Array<string> = Reflect.getMetadata("alsatian:teardown", testFixture.fixture);

     if (teardownFunctions) {
       teardownFunctions.forEach(teardownFunction => {
           testFixture.fixture[teardownFunction].call(testFixture.fixture);
       });
     }

     this._runNextTestCase();
   }

   private _exit() {
      if (this._testsFailed) {
         process.exit(1);
      }
      else {
        process.exit(0);
     }
   }

   private _runNextTestFixture() {
     this._currentTestFixtureIndex++;
     this._currentTestIndex = 0;
     this._currentTestCaseIndex = 0;

     if (!this._currentTestSet.testFixtures[this._currentTestFixtureIndex]) {
       this._exit();
     }
     else {
       this._runTest(this._currentTestSet.testFixtures[this._currentTestFixtureIndex],
               this._currentTestSet.testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
               this._currentTestSet.testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments)
     }
   }

   private _runNextTest() {

     this._currentTestIndex++;
     this._currentTestCaseIndex = 0;

     if (!this._currentTestSet.testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex]) {
       this._runNextTestFixture();
     }
     else {
       this._runTest(this._currentTestSet.testFixtures[this._currentTestFixtureIndex],
               this._currentTestSet.testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
               this._currentTestSet.testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments)
     }
   }

   private _runNextTestCase = () => {
     this._currentTestCaseIndex++;

     if (!this._currentTestSet.testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex]) {
       this._runNextTest();
     }
     else {
       this._runTest(this._currentTestSet.testFixtures[this._currentTestFixtureIndex],
               this._currentTestSet.testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
               this._currentTestSet.testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments)
     }
   }
}
