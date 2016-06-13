import * as Test from "./example-test";
import { MatchError } from "./errors/match-error";
import "reflect-metadata";

let currentTestId = 0;

let getTestDescription = (test: any, testCaseArguments: Array<any>) => {
  let testDescription = `${currentTestId} - ${test.description}`;

  if (testCaseArguments !== undefined) {
    testDescription += ` [ ${testCaseArguments.map(x => JSON.stringify(x) || "undefined").join(", ")} ]`;
  }

  return testDescription;
}

let handleError = (error: Error, test: any, testCaseArguments: Array<any>) => {
  process.stdout.write(`not ok ${getTestDescription(test, testCaseArguments)}\n`);
  if (error instanceof MatchError) {
    process.stdout.write(` ---\n   message: "${error.message}"\n   severity: fail\n   data:\n     got: ${JSON.stringify(error.actualValue)}\n     expect: ${JSON.stringify(error.expectedValue)}\n ...\n`);
  }
  else {
    process.stdout.write("# Unknown Error\n");
  }

  teardown();
}

let notifySuccess = (test: any, testCaseArguments: Array<any>) => {
  process.stdout.write(`ok ${getTestDescription(test, testCaseArguments)}\n`);
  teardown();
}

let teardown = () => {
  let testFixture = testFixtures[currentTestFixtureIndex];

  let teardownFunctions: Array<string> = Reflect.getMetadata("alsatian:teardown", testFixture.fixture);

  if (teardownFunctions) {
    teardownFunctions.forEach(teardownFunction => {
        testFixture.fixture[teardownFunction].call(testFixture.fixture);
    });
  }

  runNextTestCase();
}

let testFixtureKeys = Object.keys(Test);
let testFixtures: Array<any> = [];

let testsFocussed = false;

// CALCULATE TESTS TO RUN
testFixtureKeys.forEach(testFixtureKey => {

  if(Reflect.getMetadata("alsatian:ignore", Test[testFixtureKey])) {
    // fixture should be ignored
    return;
  }

  let testFixture: any = {};

  // create an instance of the test fixture
  testFixture.fixture = new Test[testFixtureKey]();

  // find all the tests on this test fixture
  let tests = Reflect.getMetadata("alsatian:tests", testFixture.fixture);

  if (tests.length === 0) {
    // no tests on the fixture
    return;
  }

  let focusFixture = Reflect.getMetadata("alsatian:focus", Test[testFixtureKey]);

  testFixture.tests = [];

  tests.forEach((test: any) => {

    if(Reflect.getMetadata("alsatian:ignore", testFixture.fixture, test.key)) {
      // ignore this test
      return;
    }

    let focusTest = Reflect.getMetadata("alsatian:focus", testFixture.fixture, test.key);
    test.focussed = focusFixture || focusTest;
    testsFocussed = testsFocussed || test.focussed;

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

  testFixtures.push(testFixture);
});

if (testFixtures.length === 0) {
  process.stderr.write("no tests to run\n");
  process.exit(1);
}

//Filter out unfocussed tests if any are focussed
if (testsFocussed) {
  testFixtures = testFixtures.map(x => {
    x.tests = x.tests.filter((y: any) => y.focussed)
    return x;
  });
}

// RUN
let totalTestCount = testFixtures.map(x => x.tests.map((y: any) => y.testCases.length)).reduce((a, b) => a + b).reduce((c: number, d: number) => c + d);
process.stdout.write("TAP version 13\n");
process.stdout.write(`1..${totalTestCount}\n`);

let currentTestFixtureIndex = 0;

let currentTestIndex = 0;

let currentTestCaseIndex = 0;

let exit = () => {
  process.exit(0);
}

let runNextTestFixture = () => {
  currentTestFixtureIndex++;
  currentTestIndex = 0;
  currentTestCaseIndex = 0;

  if (!testFixtures[currentTestFixtureIndex]) {
    exit();
  }
  else {
    runTest(testFixtures[currentTestFixtureIndex],
            testFixtures[currentTestFixtureIndex].tests[currentTestIndex],
            testFixtures[currentTestFixtureIndex].tests[currentTestIndex].testCases[currentTestCaseIndex].arguments)
  }
}

let runNextTest = () => {

  currentTestIndex++;
  currentTestCaseIndex = 0;

  if (!testFixtures[currentTestFixtureIndex].tests[currentTestIndex]) {
    runNextTestFixture();
  }
  else {
    runTest(testFixtures[currentTestFixtureIndex],
            testFixtures[currentTestFixtureIndex].tests[currentTestIndex],
            testFixtures[currentTestFixtureIndex].tests[currentTestIndex].testCases[currentTestCaseIndex].arguments)
  }
}

let runNextTestCase = () => {
  currentTestCaseIndex++;

  if (!testFixtures[currentTestFixtureIndex].tests[currentTestIndex].testCases[currentTestCaseIndex]) {
    runNextTest();
  }
  else {
    runTest(testFixtures[currentTestFixtureIndex],
            testFixtures[currentTestFixtureIndex].tests[currentTestIndex],
            testFixtures[currentTestFixtureIndex].tests[currentTestIndex].testCases[currentTestCaseIndex].arguments)
  }
}

let runTest = (testFixture: any, test: any, testCaseArguments: Array<any>) => {
  currentTestId++;

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
            notifySuccess(test, testCaseArguments);
          }
        })
        .catch((error: Error) => {
          handleError(error, test, testCaseArguments);
        });

        let timeoutCheck = setTimeout(() => {
          // TODO: Cancel promise on timeout instead;
          timeout = true;
          handleError(new MatchError("longer than 500ms", "less than 500ms", "The test exceeded the given timeout."), test, testCaseArguments);
        }, 500);
     }
     else {
       testFixture.fixture[test.key].apply(testFixture, testCaseArguments);
       notifySuccess(test, testCaseArguments);
     }
  }
  catch (error) {
    handleError(error, test, testCaseArguments);
  }
}

// run first test
runTest(testFixtures[currentTestFixtureIndex],
        testFixtures[currentTestFixtureIndex].tests[currentTestIndex],
        testFixtures[currentTestFixtureIndex].tests[currentTestIndex].testCases[currentTestCaseIndex].arguments)
/*
testFixtures.forEach(testFixture => {

  currentTestId++;

  // run all tests on this test fixture
  testFixture.tests.forEach((test: any) => {

    test.testCases.forEach((testCase: any) => {
      try {
         if (test.isAsync) {
            let promise: any = testFixture.fixture[test.key].apply(testFixture, testCase.arguments);
            promise.then(() => {
              notifySuccess(test, testCase.arguments);
            })
            .catch((error: Error) => {
              handleError(error, test, testCase.arguments);
            });
         }
         else {
           testFixture.fixture[test.key].apply(testFixture, testCase.arguments);
           notifySuccess(test, testCase.arguments);
         }
      }
      catch (error) {
        handleError(error, test, testCase.arguments);
      }
    });
  });
});
*/
