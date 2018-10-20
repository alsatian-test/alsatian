import { ITestFixture } from "../_interfaces/test-fixture.i";
import { ITest } from "../_interfaces/test.i";
import { TestOutcome } from "./test-outcome";
import { TestResults } from "./test-results";
import { IResultWithOutcome } from "./result-with-outcome.i";
import { getOverallOutcome } from "./get-overall-outcome";

export class TestFixtureResults implements IResultWithOutcome {
  private _testResults: Array<TestResults> = [];
  public get testResults() {
    return this._testResults;
  }

  public constructor(private _testFixture: ITestFixture) {}

  get fixture(): ITestFixture {
    return this._testFixture;
  }

  get outcome(): TestOutcome {
    return getOverallOutcome(this._testResults);
  }

  public addTestResult(test: ITest): TestResults {
    const testResults = new TestResults(test);
    this._testResults.push(testResults);
    return testResults;
  }
}
