import { Readable as ReadableStream } from "stream";
import { ITest, ITestFixture } from "./_interfaces";
import { MatchError } from "./errors";
import { TestCaseResult, TestOutcome } from "./results";
import { stringify } from "./stringification";

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

  public emitResult(testId: number, result: TestCaseResult): void {
    const outcome = result.outcome;
    const test = result.test;
    const testCaseArguments = result.arguments;

    if (outcome === TestOutcome.Pass) {
      this._emitPass(testId, test, testCaseArguments);
    } else if (outcome === TestOutcome.Fail || outcome === TestOutcome.Error) {
      this._emitFail(testId, test, testCaseArguments, result.error);
    } else if (outcome === TestOutcome.Skip) {
      this._emitSkip(testId, test, testCaseArguments);
    } else {
      throw new TypeError(`Invalid test outcome: ${outcome}`);
    }
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
    error: Error | null
  ): void {
    const description = this._getTestDescription(test, testCaseArguments);

    this._writeOut(`not ok ${testId} ${description}\n`);

    // if it's a match error then log it properly, otherwise log it as unhandled
    if (error instanceof MatchError) {
      this._writeMatchErrorOutput(error);
    } else {
      this._writeUnhandledErrorOutput(error);
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

    this._writeFailure(sanitisedMessage, sanitisedActual, sanitisedExpected);
  }

  private _writeUnhandledErrorOutput(error: Error | null): void {
    this._writeFailure(
      "The test threw an unhandled error.",
      "an unhandled error",
      "no unhandled errors to be thrown",
      error instanceof Error ? error.stack : undefined
    );
  }

  private _writeFailure(
    message: string,
    actual: string,
    expected: string,
    stack?: string
  ): void {
    let output =
      " ---\n" +
      '   message: "' +
      message +
      '"\n' +
      "   severity: fail\n" +
      "   data:\n" +
      "     got: " +
      actual +
      "\n" +
      "     expect: " +
      expected +
      "\n";

    if (stack) {
      output = output + "     stack: |\n";

      output =
        output +
        stack
          .split("\n")
          .map(l => "       " + l)
          .join("\n") +
        "\n";
    }

    output = output + " ...\n";

    this._writeOut(output);
  }
}
