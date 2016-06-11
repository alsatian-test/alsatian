import * as Test from "./example-test";
import { MatchError } from "./match-error";
import "reflect-metadata";

let getTestDescription = (test: any, testCaseArguments: Array<any>) => {
  let testDescription = `${test.description}`;

  if (testCaseArguments !== undefined) {
    testDescription += ` [ ${testCaseArguments.map(x => JSON.stringify(x) || "undefined").join(", ")} ]`;
  }

  return testDescription;
}

let handleError = (error: Error, test: any, testCaseArguments: Array<any>) => {
  process.stdout.write(`not ok ${getTestDescription(test, testCaseArguments)}\n`);
  if (error instanceof MatchError) {
    process.stdout.write(`   ---\n   message: "${error.message}"\n   severity: fail\n   data:\n     got: ${JSON.stringify(error.actualValue)}\n     expect: ${JSON.stringify(error.expectedValue)}\n   ...\n`);
  }
  else {
    process.stdout.write("# Unknown Error\n");
  }

  runNextTestCase();
}

let notifySuccess = (test: any, testCaseArguments: Array<any>) => {
  process.stdout.write(`ok ${getTestDescription(test, testCaseArguments)}\n`);
  runNextTestCase();
}

let testFixtureKeys = Object.keys(Test);
let testFixtures: Array<any> = [];

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

  testFixture.tests = [];

  tests.forEach((test: any) => {

    if(Reflect.getMetadata("alsatian:ignore", testFixture.fixture, test.key)) {
      // ignore this test
      return;
    }

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

// RUN
let totalTestCount = testFixtures.map(x => x.tests.map((y: any) => y.testCases.length)).reduce((a, b) => a + b).reduce((c: number, d: number) => c + d);
process.stdout.write("TAP version 13\n");
process.stdout.write(`1..${totalTestCount}\n`);

let currentTestFixtureIndex = 0;

let currentTestIndex = 0;

let currentTestCaseIndex = 0;

let exit = () => {
  console.log("all done");
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
  try {
     if (test.isAsync) {
        let timeout = false;

        let promise: any = testFixture.fixture[test.key].apply(testFixture, testCaseArguments);
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
          handleError(new Error("Timeout"), test, testCaseArguments);
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
