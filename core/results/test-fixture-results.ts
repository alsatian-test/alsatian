import { ITestFixture } from "../_interfaces/test-fixture.i";
import { ITest } from "../_interfaces/test.i";
import { TestOutcome } from "./test-outcome";
import { TestResults } from "./test-results";

export class TestFixtureResults {
  private _testResults: Array<TestResults> = [];
  public get testResults() {
    return this._testResults;
  }

  public constructor(private _testFixture: ITestFixture) {}

  get fixture(): ITestFixture {
    return this._testFixture;
  }

  get outcome(): TestOutcome {
    const outcomes = this._testResults.map(testResult => testResult.outcome);

    if (outcomes.indexOf(TestOutcome.Error) !== -1) {
      return TestOutcome.Error;
    }

    if (outcomes.indexOf(TestOutcome.Fail) !== -1) {
      return TestOutcome.Fail;
    }

    if (outcomes.indexOf(TestOutcome.Pass) !== -1) {
      return TestOutcome.Pass;
    }

    return TestOutcome.Skip;
  }

  public addTestResult(test: ITest): TestResults {
    const testResults = new TestResults(test);
    this._testResults.push(testResults);
    return testResults;
  }
}
