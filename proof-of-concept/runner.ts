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
  let testKeys = Reflect.getMetadata("alsatian:tests", testFixture.fixture);

  if (testKeys.length === 0) {
    console.error("no tests found");
    return;
  }

  testFixture.tests = [];

  testKeys.forEach((testKey: string) => {
    let test: any = {};
    testFixture.tests.push(test);

    test.key = testKey;
    test.description = testKey;

    let testCases = Reflect.getMetadata("alsatian:testcases", testFixture.fixture, testKey);
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

    // if there are no test cases then just run the test
    /*if (!testFixture.test) {
      try {
        testFixture.fixture[testKey].call(this);
        console.log("ok");
      }
      catch(error) {
        console.log("not ok");
      }
    }*/
    // otherwise pass all the test case arguments
    //else {
      test.testCases.forEach((testCase: any) => {
        try {
          testFixture.fixture[test.key].apply(this, testCase.arguments);
          console.log("ok", test.description);
        }
        catch(error) {
          console.log("not ok", test.description);
        }
      });
    //}
  });
});
