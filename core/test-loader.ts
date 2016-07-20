import { ITestFixture } from "./_interfaces/test-fixture.i";
import { ITest } from "./_interfaces/test.i";
import { ITestCase } from "./_interfaces/test-case.i";
import { FileRequirer } from "./file-requirer";

export class TestLoader {

   public constructor(private _fileRequirer: FileRequirer) { }

  loadTestFixture(filePath: string): ITestFixture {
    let Test = this._fileRequirer.require(filePath);
    let testFixtureKeys = Object.keys(Test);
    let testFixture: ITestFixture = <ITestFixture>{};

    // CALCULATE TESTS TO RUN
    testFixtureKeys.forEach(testFixtureKey => {

      testFixture.ignored = false;

      if (Reflect.getMetadata("alsatian:ignore", Test[testFixtureKey])) {
        // fixture should be ignored
        testFixture.ignored = true;
      }

      // create an instance of the test fixture
      testFixture.fixture = new Test[testFixtureKey]();

      // find all the tests on this test fixture
      let tests = Reflect.getMetadata("alsatian:tests", testFixture.fixture);

      let focusFixture = Reflect.getMetadata("alsatian:focus", Test[testFixtureKey]);

      testFixture.tests = [];

      if (!tests || tests.length === 0) {
        // no tests on the fixture
        return testFixture;
      }

      tests.forEach((test: ITest) => {

        if (Reflect.getMetadata("alsatian:ignore", testFixture.fixture, test.key)) {
          // ignore this test
          return;
        }

        let focusTest = Reflect.getMetadata("alsatian:focus", testFixture.fixture, test.key);

        test.focussed = focusFixture || focusTest;

        testFixture.tests.push(test);

        if (!test.description) {
           test.description = test.key;
        }

        let testCases = Reflect.getMetadata("alsatian:testcases", testFixture.fixture, test.key);
        test.testCases = [];

        if (!testCases) {
          test.testCases.push({ arguments: [] });
        }
        else {
          testCases.forEach((testCase: ITestCase) => {
           test.testCases.push(testCase);
          });
        }
      });


   });
   return testFixture;
  }
}
