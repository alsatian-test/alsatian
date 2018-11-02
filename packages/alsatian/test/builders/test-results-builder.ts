import { TestResults } from "../../core/results";
import { TestFixtureResultsBuilder } from "./test-fixture-results-builder";
import { TestBuilder } from "./test-builder";
import { ITest } from "../../core/_interfaces";

export class TestResultsBuilder {
  private _test: ITest = new TestBuilder().build();

  public withTest(test: ITest) {
    this._test = test;
    return this;
  }

  public build() {
    return new TestResults(new TestFixtureResultsBuilder().build(), this._test);
  }
}
