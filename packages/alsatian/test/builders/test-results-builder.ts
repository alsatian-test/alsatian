import { TestResults, TestFixtureResults } from "../../core/results";
import { TestFixtureResultsBuilder } from "./test-fixture-results-builder";
import { TestBuilder } from "./test-builder";
import { ITest } from "../../core/_interfaces";

export class TestResultsBuilder {
  private _test: ITest = new TestBuilder().build();
  private _testFixtureResults = new TestFixtureResultsBuilder().build();

  public withTest(test: ITest) {
    this._test = test;
    return this;
  }

  public withTestFixtureResults(testFixtureResults: TestFixtureResults) {
    this._testFixtureResults = testFixtureResults;
    return this;
  }

  public build() {
    return new TestResults(this._testFixtureResults, this._test);
  }
}
