import * as Test from "./example-test";
import "reflect-metadata";

let testFixtureKeys = Object.keys(Test);

testFixtureKeys.forEach(testFixtureKey => {
  // create an instance of the test fixture
  let testFixture = new Test[testFixtureKey]();

  // find all the tests on this test fixture
  let testKeys = Reflect.getMetadata("alsatian:tests", testFixture);

  // run all tests on this test fixture
  testKeys.forEach((testKey: string) => {

    let testCases = Reflect.getMetadata("alsatian:testcases", testFixture, testKey);

    // if there are no test cases then just run the test
    if (!testCases) {
      console.log(testFixture[testKey].call(this));
    }
    // otherwise pass all the test case arguments
    else {
      testCases.forEach((testCase: any) => {
        console.log(testFixture[testKey].apply(this, testCase.arguments));
      });
    }
  });
});
