import { ITestFixture } from "../_interfaces/test-fixture.i";
import { TestFixtureResults } from "./test-fixture-results";
import { TestOutcome } from "./test-outcome";
import { IResultWithOutcome } from "./result-with-outcome.i";
import { getOverallOutcome } from "./get-overall-outcome";

export class TestSetResults implements IResultWithOutcome {
  private _testFixtureResults: Array<TestFixtureResults> = [];
  public get testFixtureResults() {
    return this._testFixtureResults;
  }

  get outcome(): TestOutcome {
    return getOverallOutcome(this._testFixtureResults);
  }

  public addTestFixtureResult(testFixture: ITestFixture): TestFixtureResults {
    const testFixtureResult = new TestFixtureResults(testFixture);
    this._testFixtureResults.push(testFixtureResult);
    return testFixtureResult;
  }
}
