import { ITestFixture } from "./_interfaces/test-fixture.i";
import { ITest } from "./_interfaces/test.i";
import { ITestCase } from "./_interfaces/test-case.i";
import { FileRequirer } from "./file-requirer";
import { TestFixture } from "./test-fixture";
import { METADATA_KEYS } from "./alsatian-core";

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
      let testFixture = new TestFixture();

      testFixture.ignored = false;

      if (Reflect.getMetadata(METADATA_KEYS.IGNORE_KEY, testFixtureConstructor)) {
        // fixture should be ignored
        testFixture.ignored = true;
      }

      // create an instance of the test fixture
      testFixture.fixture = new testFixtureConstructor();

      // find all the tests on this test fixture
      let tests = Reflect.getMetadata(METADATA_KEYS.TEST_KEY, testFixture.fixture);

      testFixture.focussed = false;

      if (Reflect.getMetadata(METADATA_KEYS.FOCUS_KEY, testFixtureConstructor)) {
        testFixture.focussed = true;
      }

      testFixture.tests = [];

      if (tests === undefined) {
        // no tests on the fixture
        return null;
      }

      tests.forEach((test: ITest) => {

        test.ignored = false;
        if (Reflect.getMetadata(METADATA_KEYS.IGNORE_KEY, testFixture.fixture, test.key)) {
          test.ignored = true;

          test.ignoreReason = Reflect.getMetadata(METADATA_KEYS.IGNORE_REASON_KEY, testFixture.fixture, test.key);
        }

        test.focussed = false;

        if (Reflect.getMetadata(METADATA_KEYS.FOCUS_KEY, testFixture.fixture, test.key)) {
          test.focussed = true;
        }

        test.timeout = Reflect.getMetadata(METADATA_KEYS.TIMEOUT_KEY, testFixture.fixture, test.key) || null;

        testFixture.addTest(test);

        if (!test.description) {
           test.description = test.key;
        }

        let testCases = Reflect.getMetadata(METADATA_KEYS.TEST_CASES_KEY, testFixture.fixture, test.key);
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
