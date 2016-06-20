import * as Glob from "glob";
const path = require("path");

export class TestSet {

  private _testsFocussed: boolean;
  private _testFixtures: Array<any> = [];
  public get testFixtures(): Array<any> {
    return this._testFixtures;
  }

  public constructor (testFileLocation: string)
  public constructor (testFileLocations: Array<string>)
  public constructor(testsFileLocations: string | Array<string>) {

    if (typeof testsFileLocations === "string") {
      testsFileLocations = [ <string>testsFileLocations ];
    }

    this._loadTestFixtures(<Array<string>>testsFileLocations);

    // Filter out unfocussed tests if any are focussed
    if (this._testsFocussed) {
      this._testFixtures = this._testFixtures.map(x => {
        x.tests = x.tests.filter((y: any) => y.focussed)
        return x;
      }).filter(testFixture => testFixture.tests.length !== 0);
    }
  }

  private _loadTestFixtures(testFileLocations: Array<string>) {
     testFileLocations.forEach(testFileLocation => {

        testFileLocation = path.join(process.cwd(), testFileLocation);

        if (Glob.hasMagic(testFileLocation)) {
          let physicalTestFileLocations = Glob.sync(testFileLocation);

          physicalTestFileLocations.forEach(physicalTestFileLocation => {

              this._loadTest(require(physicalTestFileLocation));
          });
        }
        else {
          this._loadTest(require(testFileLocation));
        }
     });
  }

  private _loadTest(Test: any) {
     let testFixtureKeys = Object.keys(Test);

     // CALCULATE TESTS TO RUN
     testFixtureKeys.forEach(testFixtureKey => {

       if (Reflect.getMetadata("alsatian:ignore", Test[testFixtureKey])) {
         // fixture should be ignored
         return;
       }

       let testFixture: any = {};

       // create an instance of the test fixture
       testFixture.fixture = new Test[testFixtureKey]();

       // find all the tests on this test fixture
       let tests = Reflect.getMetadata("alsatian:tests", testFixture.fixture);

       if (!tests || tests.length === 0) {
         // no tests on the fixture
         return;
       }

       let focusFixture = Reflect.getMetadata("alsatian:focus", Test[testFixtureKey]);

       testFixture.tests = [];

       tests.forEach((test: any) => {

         if (Reflect.getMetadata("alsatian:ignore", testFixture.fixture, test.key)) {
           // ignore this test
           return;
         }

         let focusTest = Reflect.getMetadata("alsatian:focus", testFixture.fixture, test.key);
         test.focussed = focusFixture || focusTest;
         this._testsFocussed = this._testsFocussed || test.focussed;

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

       this._testFixtures.push(testFixture);
     });
  }
}
