import { MatchError } from "./errors/match-error";
import "reflect-metadata";

export class TestRunner {

   private _testFixtures: Array<any> = [];
   private _testsFocussed: boolean;
   private _currentTestId: number = 0;
   private _currentTestFixtureIndex: number = 0;
   private _currentTestIndex: number = 0;
   private _currentTestCaseIndex: number = 0;

   public run() {

      if (this._testFixtures.length === 0) {
        process.stderr.write("no tests to run\n");
        process.exit(1);
      }

      this._runTest(this._testFixtures[this._currentTestFixtureIndex],
              this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
              this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments)
   }

   public loadTests(testFileLocations: Array<string>) {
      testFileLocations.forEach(testFileLocation => {
         this._loadTest(require(testFileLocation));
      });
   }

   public loadTest(testFileLocation: string) {
      this._loadTest(require(testFileLocation));
   }

   private _loadTest(Test: any) {
      let testFixtureKeys = Object.keys(Test);

      // CALCULATE TESTS TO RUN
      testFixtureKeys.forEach(testFixtureKey => {

        if (Reflect.getMetadata("alsatian:ignore", Test[testFixtureKey])) {
          // fixture should be ignored
          return;
        }

        let testFixture: any = {};

        // create an instance of the test fixture
        testFixture.fixture = new Test[testFixtureKey]();

        // find all the tests on this test fixture
        let tests = Reflect.getMetadata("alsatian:tests", testFixture.fixture);

        if (!tests || tests.length === 0) {
          // no tests on the fixture
          return;
        }

        let focusFixture = Reflect.getMetadata("alsatian:focus", Test[testFixtureKey]);

        testFixture.tests = [];

        tests.forEach((test: any) => {

          if (Reflect.getMetadata("alsatian:ignore", testFixture.fixture, test.key)) {
            // ignore this test
            return;
          }

          let focusTest = Reflect.getMetadata("alsatian:focus", testFixture.fixture, test.key);
          test.focussed = focusFixture || focusTest;
          this._testsFocussed = this._testsFocussed || test.focussed;

          testFixture.tests.push(test);

          if (!test.description) {
             test.description = test.key;
          }

          let testCases = Reflect.getMetadata("alsatian:testcases", testFixture.fixture, test.key);
          test.testCases = [];

          if (!testCases) {
            test.testCases.push([]);
          }
          else {
            testCases.forEach((testCase: any) => {
              test.testCases.push(testCase);
            });
          }
        });

        this._testFixtures.push(testFixture);
      });

      // Filter out unfocussed tests if any are focussed
      if (this._testsFocussed) {
        this._testFixtures = this._testFixtures.map(x => {
          x.tests = x.tests.filter((y: any) => y.focussed)
          return x;
        });
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
     let testFixture = this._testFixtures[this._currentTestFixtureIndex];

     let teardownFunctions: Array<string> = Reflect.getMetadata("alsatian:teardown", testFixture.fixture);

     if (teardownFunctions) {
       teardownFunctions.forEach(teardownFunction => {
           testFixture.fixture[teardownFunction].call(testFixture.fixture);
       });
     }

     this._runNextTestCase();
   }

   private _exit() {
     process.exit(0);
   }

   private _runNextTestFixture() {
     this._currentTestFixtureIndex++;
     this._currentTestIndex = 0;
     this._currentTestCaseIndex = 0;

     if (!this._testFixtures[this._currentTestFixtureIndex]) {
       this._exit();
     }
     else {
       this._runTest(this._testFixtures[this._currentTestFixtureIndex],
               this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
               this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments)
     }
   }

   private _runNextTest() {

     this._currentTestIndex++;
     this._currentTestCaseIndex = 0;

     if (!this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex]) {
       this._runNextTestFixture();
     }
     else {
       this._runTest(this._testFixtures[this._currentTestFixtureIndex],
               this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex],
               this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments)
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
               this._testFixtures[this._currentTestFixtureIndex].tests[this._currentTestIndex].testCases[this._currentTestCaseIndex].arguments)
     }
   }
}
