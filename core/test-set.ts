import { GlobHelper, TestLoader } from "./_Core";
import { ITestFixture } from "./_interfaces/test-fixture.i";

const path = require("path");

export class TestSet {

  private _testFixtures: Array<ITestFixture> = [];

  public get testFixtures(): Array<ITestFixture> {
    return this._testFixtures;
  }

  public constructor(private _testLoader: TestLoader, private _globHelper: GlobHelper) { }

  public addTestsFromFiles (testFileLocation: string): void
  public addTestsFromFiles (testFileLocations: Array<string>): void
  public addTestsFromFiles (testsFileLocations: string | Array<string>) {

    if (typeof testsFileLocations === "string") {
      testsFileLocations = [ <string>testsFileLocations ];
    }

    this._loadTestFixtures(<Array<string>>testsFileLocations);

    let anyTestsFocussed = this._testFixtures.filter(testFixture => testFixture.focussed || testFixture.tests.filter(test => test.focussed).length > 0).length > 0;

    // Filter out unfocussed tests if any are focussed
    if (anyTestsFocussed) {
      this._testFixtures = this._testFixtures.filter(testFixture => testFixture.focussed || testFixture.tests.filter(test => test.focussed).length > 0);
      /*this._testFixtures = this._testFixtures.map(x => {
        x.tests = x.tests.filter(test => test.focussed);
        return x;
      }).filter(testFixture => testFixture.tests.length !== 0);*/
    }
  }

  private _loadTestFixtures(testFileLocations: Array<string>) {
     testFileLocations.forEach(testFileLocation => {

        testFileLocation = path.join(process.cwd(), testFileLocation);

        if (this._globHelper.isGlob(testFileLocation)) {
          let physicalTestFileLocations = this._globHelper.resolve(testFileLocation);

          physicalTestFileLocations.forEach(physicalTestFileLocation => {
             this._testFixtures = this.testFixtures.concat(this._testLoader.loadTestFixture(physicalTestFileLocation));
          });
        }
        else {
           this._testFixtures = this.testFixtures.concat(this._testLoader.loadTestFixture(testFileLocation));
        }
     });
  }
}
