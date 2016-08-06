import { ITestFixture } from "./_interfaces/test-fixture.i";
import { ITest } from "./_interfaces/test.i";
import { ITestCase } from "./_interfaces/test-case.i";
import { FileRequirer } from "./file-requirer";

export class TestLoader {

   public constructor(private _fileRequirer: FileRequirer) { }

  loadTestFixture(filePath: string): Array<ITestFixture> {
    let Test = this._fileRequirer.require(filePath);
    let testFixtureKeys = Object.keys(Test);
    let testFixtures: Array<ITestFixture> = [];

    // if the default export is class constructor
    if (typeof Test === "function") {
      let testFixture = this._loadTestFixture(Test);
      if (testFixture !== null) {
        testFixtures.push(testFixture);
      }
    }
    // otherwise there are multiple exports and we must handle all of them
    else {
      testFixtureKeys.forEach(testFixtureKey => {
        let testFixture = this._loadTestFixture(Test[testFixtureKey]);
        if (testFixture !== null) {
          testFixtures.push(testFixture);
        }
       });
     }

     return testFixtures;
   }

  private _loadTestFixture(testFixtureConstructor: any): ITestFixture {
      let testFixture = <ITestFixture>{};

      testFixture.ignored = false;

      if (Reflect.getMetadata("alsatian:ignore", testFixtureConstructor)) {
        // fixture should be ignored
        testFixture.ignored = true;
      }

      // create an instance of the test fixture
      testFixture.fixture = new testFixtureConstructor();

      // find all the tests on this test fixture
      let tests = Reflect.getMetadata("alsatian:tests", testFixture.fixture);

      testFixture.focussed = false;

      if (Reflect.getMetadata("alsatian:focus", testFixtureConstructor)) {
        testFixture.focussed = true;
      }

      testFixture.tests = [];

      if (tests === undefined) {
        // no tests on the fixture
        return null;
      }

      tests.forEach((test: ITest) => {

        test.ignored = false;
        if (Reflect.getMetadata("alsatian:ignore", testFixture.fixture, test.key)) {
          test.ignored = true;
        }

        test.focussed = false;

        if (Reflect.getMetadata("alsatian:focus", testFixture.fixture, test.key)) {
          test.focussed = true;
        }

        test.timeout = Reflect.getMetadata("alsatian:timeout", testFixture.fixture, test.key) || null;

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

      return testFixture;
  }
}
