import * as Test from "./example-test";
import { MatchError } from "./match-error";
import "reflect-metadata";

let handleError = (error: Error, test: any) => {
  process.stdout.write(`not ok ${test.description}\n`);
  if (error instanceof MatchError) {
    process.stdout.write(`   ---\n   message: "${error.message}"\n   severity: fail\n   data:\n     got: ${JSON.stringify(error.actualValue)}\n     expect: ${JSON.stringify(error.expectedValue)}\n   ...\n`);
  }
  else {
    process.stdout.write("# Unknown Error\n");
  }
}

let testFixtureKeys = Object.keys(Test);
let testFixtures: Array<any> = [];

// CALCULATE TESTS TO RUN
testFixtureKeys.forEach(testFixtureKey => {

  let testFixture: any = {};
  testFixtures.push(testFixture);

  // create an instance of the test fixture
  testFixture.fixture = new Test[testFixtureKey]();

  // find all the tests on this test fixture
  let tests = Reflect.getMetadata("alsatian:tests", testFixture.fixture);

  if (tests.length === 0) {
    console.error("no tests found");
    return;
  }

  testFixture.tests = [];

  tests.forEach((test: any) => {
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
});

// RUN
let totalTestCount = testFixtures.map(x => x.tests.map((y: any) => y.testCases.length)).reduce((a, b) => a + b).reduce((c: number, d: number) => c + d);
process.stdout.write("TAP version 13\n");
process.stdout.write(`1..${totalTestCount}\n`);

testFixtures.forEach(testFixture => {
  // run all tests on this test fixture
  testFixture.tests.forEach((test: any) => {

    test.testCases.forEach((testCase: any) => {
      try {
         if (test.isAsync) {
            let promise: any = testFixture.fixture[test.key].apply(testFixture, testCase.arguments);
            promise.then(() => {
              process.stdout.write(`ok ${test.description}\n`);
            })
            .catch((error: Error) => {
              handleError(error, test);
            });
         }
         else {
           testFixture.fixture[test.key].apply(testFixture, testCase.arguments);
           process.stdout.write(`ok ${test.description}\n`);
         }
      }
      catch (error) {
        handleError(error, test);
      }
    });
  });
});
