import * as Test from "./example-test";
import "reflect-metadata";

let testFixtureKeys = Object.keys(Test);

testFixtureKeys.forEach(testFixtureKey => {
  // create an instance of the test fixture
  let testFixture = new Test[testFixtureKey]();

  // find all the tests on this test fixture
  let testKeys = Reflect.getMetadata("alsatian:tests", testFixture);

  if (testKeys.length === 0) {
    console.error("no tests found");
    return;
  }

  console.log("1.." + testKeys.length);

  // run all tests on this test fixture
  testKeys.forEach((testKey: string) => {

    let testCases = Reflect.getMetadata("alsatian:testcases", testFixture, testKey);

    // if there are no test cases then just run the test
    if (!testCases) {
      try {
        testFixture[testKey].call(this);
        console.log("ok");
      }
      catch(error) {
        console.log("not ok");
      }
    }
    // otherwise pass all the test case arguments
    else {
      testCases.forEach((testCase: any) => {
        try {
          testFixture[testKey].apply(this, testCase.arguments);
          console.log("ok");
        }
        catch(error) {
          console.log("not ok");
        }
      });
    }
  });
});
