import { ITest, ITestFixture } from "./_interfaces";

/**
 * Represents an Alsatian Test Fixture. That is the container for multiple tests.
 */
export class TestFixture implements ITestFixture {
  /**
   * The test fixture Class that contains all the tests
   */
  public fixture: { [id: string]: (...args: Array<any>) => any };

  /**
   * Determines if the current fixture should be ignored
   */
  public ignored: boolean;

  /**
   * The provided reason to ignore the fixture
   */
  public ignoreReason: string;

  /**
   * Determines if the current fixture is focused
   */
  public focussed: boolean;

  /**
   * The description of the fixture
   */
  public description: string;

  /**
   * The list of tests
   */
  private _tests: Array<ITest> = [];

  /**
   * Returns the list of tests
   */
  public get tests() {
    return this._tests;
  }

  /**
   * Creates a new TextFixture class
   * @param description The Fixture description
   */
  constructor(description: string) {
    this.focussed = false;
    this.ignored = false;
    this.ignoreReason = "";
    this.fixture = {};
    this.description = description;
  }

  /**
   * Adds a test to the Fixture
   * @param test The test to add
   */
  public addTest(test: ITest): void {
    // if the test is already here, don't add it
    if (this.tests.indexOf(test) !== -1) {
      return;
    }

    this.tests.push(test);
  }
}
