import * as path from "path";
import { FileRequirer, GlobHelper, TestLoader } from "./";
import { ITestFixture } from "./_interfaces";

/**
 * A TestSet is a container for all the Fixtures inside the current testing session.
 */
export class TestSet {
  /**
   * Static Factory method to create a TestSet instance
   */
  public static create(): TestSet {
    const fileRequirer = new FileRequirer();
    const testLoader = new TestLoader(fileRequirer);
    const globHelper = new GlobHelper();
    return new TestSet(testLoader, globHelper);
  }

  /**
   * The TestLoader instance
   */
  private _testLoader: TestLoader;

  /**
   * The GlobHelper instance, used to work with globs
   */
  private _globHelper: GlobHelper;

  /**
   * An array with all the fixtures in the given Test set
   */
  private _testFixtures: Array<ITestFixture> = [];

  /**
   * Get an array with all the test fixtures in the current Test Set
   */
  public get testFixtures(): Array<ITestFixture> {
    return this._testFixtures;
  }

  /**
   * Creates a new TestSet instance
   * @param testLoader A TestLoader instance
   * @param globHelper A GlobHelper instance
   */
  public constructor(testLoader: TestLoader, globHelper: GlobHelper) {
    if (testLoader === null || testLoader === undefined) {
      throw new TypeError("testLoader must not be null or undefined.");
    }

    if (globHelper === null || globHelper === undefined) {
      throw new TypeError("globHelper must not be null or undefined.");
    }

    this._testLoader = testLoader;
    this._globHelper = globHelper;
  }

  /**
   * Load the tests from a file or files into the current TestSet
   * @param testsFileLocations A glob string or array of glob string with the files to be loaded
   */
  public addTestsFromFiles(testsFileLocations: string | Array<string>) {
    let locationArray: Array<string>;

    if (typeof testsFileLocations === "string") {
      locationArray = [testsFileLocations];
    } else {
      locationArray = testsFileLocations;
    }

    this._loadTestFixtures(locationArray);
  }

  /**
   * Load the test fixtures from a set of files
   * @param testFileLocations An array of globs for the files that contains the fixtures
   */
  private _loadTestFixtures(testFileLocations: Array<string>) {
    testFileLocations.forEach(testFileLocation => {
      testFileLocation = path.resolve(testFileLocation);

      if (this._globHelper.isGlob(testFileLocation)) {
        const physicalTestFileLocations = this._globHelper.resolve(
          testFileLocation
        );

        physicalTestFileLocations.forEach(physicalTestFileLocation => {
          this._testFixtures = this.testFixtures.concat(
            this._testLoader.loadTestFixture(physicalTestFileLocation)
          );
        });
      } else {
        this._testFixtures = this.testFixtures.concat(
          this._testLoader.loadTestFixture(testFileLocation)
        );
      }
    });
  }
}
