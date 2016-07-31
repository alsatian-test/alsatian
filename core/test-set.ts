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
