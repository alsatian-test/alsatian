import { Readable as ReadableStream } from "stream";
import { ITest, ITestFixture } from "./_interfaces";
import { MatchError } from "./errors";
import { TestCaseResult, TestOutcome } from "./results";
import { stringify } from "./stringification";
import { safeDump } from "js-yaml";

export class TestOutputStream extends ReadableStream {
  public _read() {} // tslint:disable-line:no-empty

  public end() {
    this.push(null);
  }

  public emitVersion(): void {
    this._writeOut("TAP version 13\n");
  }

  public emitPlan(testCount: number): void {
    this._writeOut(`1..${testCount}\n`);
  }

  public emitFixture(fixture: ITestFixture): void {
    this._writeOut(`# FIXTURE ${fixture.description}\n`);
  }

  public emitLog(...logs: Array<string>): void {
    this._writeLogs(logs, "LOG");
  }

  public emitWarning(...warnings: Array<string>): void {
    this._writeLogs(warnings, "WARN");
  }

  public emitResult(testId: number, result: TestCaseResult): void {
    const outcome = result.outcome;
    const test = result.test;
    const testCaseArguments = result.arguments;

    if (outcome === TestOutcome.Pass) {
      this._emitPass(testId, test, testCaseArguments);
    } else if (outcome === TestOutcome.Fail || outcome === TestOutcome.Error) {
      this._emitFail(testId, test, testCaseArguments, result);
    } else if (outcome === TestOutcome.Skip) {
      this._emitSkip(testId, test, testCaseArguments);
    } else {
      throw new TypeError(`Invalid test outcome: ${outcome}`);
    }
  }

  private _writeLogs(logs: Array<string>, level: string) {
    this._writeOut(`# ${level}: ${logs.join(" ")}\n`);
  }

  private _writeOut(message: string): void {
    this.push(message);
  }

  private _emitPass(
    testId: number,
    test: ITest,
    testCaseArguments: Array<any>
  ): void {
    const description = this._getTestDescription(test, testCaseArguments);

    this._writeOut(`ok ${testId} ${description}\n`);
  }

  private _emitSkip(
    testId: number,
    test: ITest,
    testCaseArguments: Array<any>
  ): void {
    const description = this._getTestDescription(test, testCaseArguments);

    // we only want to use the reason if it's not undefined
    let reasonString = "";

    if (test.ignoreReason !== undefined) {
      reasonString = ` ${test.ignoreReason}`;
    }

    this._writeOut(`ok ${testId} ${description} # skip${reasonString}\n`);
  }

  private _emitFail(
    testId: number,
    test: ITest,
    testCaseArguments: Array<any>,
    result: TestCaseResult
  ): void {
    const description = this._getTestDescription(test, testCaseArguments);

    this._writeOut(`not ok ${testId} ${description}\n`);

    if (result.error instanceof MatchError) {
      this._writeMatchErrorOutput(result.error);
    } else {
      this._writeUnhandledErrorOutput(result.error);
    }
  }

  private _getTestDescription(
    test: ITest,
    testCaseArguments: Array<any>
  ): string {
    if (testCaseArguments === undefined || testCaseArguments.length <= 0) {
      return test.description;
    }

    const formattedArguments = testCaseArguments.map(stringify).join(", ");

    return `${test.description} ( ${formattedArguments} )`;
  }

  private _writeMatchErrorOutput(error: MatchError): void {
    const sanitisedMessage = error.message
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');
    const sanitisedActual = stringify(error.actual);
    const sanitisedExpected = stringify(error.expected);

    this._writeFailure(
      sanitisedMessage,
      sanitisedActual,
      sanitisedExpected,
      error.extras
    );
  }

  private _writeUnhandledErrorOutput(error: Error | null): void {
    this._writeFailure(
      "The test threw an unhandled error.",
      "an unhandled error",
      "no unhandled errors to be thrown",
      error instanceof Error ? { stack: error.stack } : undefined
    );
  }

  private _writeFailure(
    message: string,
    actual: string,
    expected: string,
    details?: { [props: string]: any }
  ): void {
    const output = {
      message,
      severity: "fail",
      data: {
        got: actual,
        expect: expected,
        details
      }
    };

    if (output.data.details === undefined) {
      delete output.data.details;
    }

    this._writeOut(
      ` ---\n${safeDump(output)
        .split("\n")
        .map(s => ` ${s}`)
        .join("\n")}...\n`
    );
  }
}
