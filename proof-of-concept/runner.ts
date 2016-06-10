import * as Test from "./example-test";
import "reflect-metadata";

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
console.log("1.." + totalTestCount);

testFixtures.forEach(testFixture => {
  // run all tests on this test fixture
  testFixture.tests.forEach((test: any) => {

    test.testCases.forEach((testCase: any) => {
      try {
         if (test.isAsync) {
            let promise: any = testFixture.fixture[test.key].apply(testFixture, testCase.arguments);
            promise.then(() => {
               console.log("ok", test.description);
            })
            .catch(() => {
               console.log("not ok", test.description);
            });
         }
         else {
           testFixture.fixture[test.key].apply(testFixture, testCase.arguments);
           console.log("ok", test.description);
         }
      }
      catch (error) {
        console.log("not ok", test.description, error);
      }
    });
  });
});
