import { ITest } from "../_interfaces/test.i";
import { TestCaseResult } from "./test-case-result";
import { TestOutcome } from "./test-outcome";
import { IResultWithOutcome } from "./result-with-outcome.i";
import { getOverallOutcome } from "./get-overall-outcome";
import { IMatcher } from "../running/test-item";

export class TestResults implements IResultWithOutcome {
  private _testCaseResults: Array<TestCaseResult> = [];

  public constructor(private _test: ITest) {}

  public get test(): ITest {
    return this._test;
  }

  public get outcome(): TestOutcome {
    return getOverallOutcome(this._testCaseResults);
  }

  public addTestCaseResult(
    args: Array<any>,
    error: Error | null = null,
    extras?: IMatcher
  ): TestCaseResult {
    const testCaseResult = new TestCaseResult(this._test, args, error, extras);
    this._testCaseResults.push(testCaseResult);
    return testCaseResult;
  }
}
