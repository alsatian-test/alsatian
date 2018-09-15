import { ITest } from "../_interfaces/test.i";
import { MatchError } from "../errors";
import { TestOutcome } from "./test-outcome";
import { IResultWithOutcome } from "./result-with-outcome.i";
import { IMatcher } from "../running/test-item";

export class TestCaseResult implements IResultWithOutcome {
  private _test: ITest;
  private _arguments: Array<any>;
  private _error: Error | null;
  private _extras?: IMatcher;

  public constructor(
    test: ITest,
    testCaseArguments: Array<any>,
    error: Error | null = null,
    extras?: IMatcher
  ) {
    this._test = test;
    this._arguments = testCaseArguments;
    this._error = error;
    this._extras = extras;
  }

  public get outcome(): TestOutcome {
    if (this._error) {
      if (this._error instanceof MatchError) {
        return TestOutcome.Fail;
      }

      return TestOutcome.Error;
    }

    if (this._test.ignored) {
      return TestOutcome.Skip;
    }

    return TestOutcome.Pass;
  }

  public get test(): ITest {
    return this._test;
  }

  public get arguments() {
    return this._arguments;
  }

  public get error(): Error | null {
    return this._error;
  }

  public get extras() {
    return this._extras;
  }
}
