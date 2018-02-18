import { Readable as ReadableStream } from "stream";
import { ITest, ITestFixture } from "./_interfaces";
import { MatchError } from "./errors";
import { TestCaseResult, TestOutcome } from "./results";
import { stringify } from "./stringification";

/**
 * Class used by alsatian to emit a valid TAP stream to process.stdout
 * @see https://testanything.org/tap-specification.html
 * @export
 * @class TestOutputStream
 * @extends {ReadableStream}
 */
export class TestOutputStream extends ReadableStream {
  /**
   * Not used
   * @memberof TestOutputStream
   */
  public _read() {} // tslint:disable-line:no-empty

  /**
   * Emit the corresponding signal to the stream to end the stream
   * @memberof TestOutputStream
   */
  public end() {
    this.push(null);
  }

  /**
   * Emits the TAP version
   * @see https://testanything.org/tap-specification.html
   * @memberof TestOutputStream
   */
  public emitVersion(): void {
    this._writeOut("TAP version 13\n");
  }

  /**
   * Emits the current test plan. That is, the number of test that will run.
   * @see https://testanything.org/tap-specification.html
   * @param testCount
   */
  public emitPlan(testCount: number): void {
    this._writeOut(`1..${testCount}\n`);
  }

  /**
   *
   * @param fixture
   */
  public emitFixture(fixture: ITestFixture): void {
    this._writeOut(`# FIXTURE ${fixture.description}\n`);
  }

  /**
   * Emits the result of a specific test
   * @param testId The id of the test
   * @param result The result of the test
   */
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

  /**
   * Writes a string to the console
   * @private
   * @param {string} message
   * @memberof TestOutputStream
   */
  private _writeOut(message: string): void {
    this.push(message);
  }

  /**
   * Emits a passing test
   *
   * @private
   * @param {number} testId The id of the test
   * @param {ITest} test The test
   * @param {Array<any>} testCaseArguments The argument of the test case
   * @memberof TestOutputStream
   */
  private _emitPass(
    testId: number,
    test: ITest,
    testCaseArguments: Array<any>
  ): void {
    const description = this._getTestDescription(test, testCaseArguments);

    this._writeOut(`ok ${testId} ${description}\n`);
  }

  /**
   * Emits a skipped test
   *
   * @private
   * @param {number} testId The test id
   * @param {ITest} test The test
   * @param {Array<any>} testCaseArguments The test case arguments
   * @memberof TestOutputStream
   */
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

  /**
   * Emits a failing test
   *
   * @private
   * @param {number} testId The test id
   * @param {ITest} test The test
   * @param {Array<any>} testCaseArguments The test case arguments
   * @param {(Error | null)} error The Error object (if exits) that thrown the test
   * @memberof TestOutputStream
   */
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

  /**
   * Generates a test description string
   * @private
   * @param {ITest} test The test
   * @param {Array<any>} testCaseArguments The test case argument
   * @returns {string} The generated test description
   * @memberof TestOutputStream
   */
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

  /**
   * Emits the error output in TAP format
   *
   * @private
   * @param {MatchError} error The error
   * @memberof TestOutputStream
   */
  private _writeMatchErrorOutput(error: MatchError): void {
    const sanitisedMessage = error.message
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');
    const sanitisedActual = stringify(error.actual);
    const sanitisedExpected = stringify(error.expected);

    this._writeFailure(sanitisedMessage, sanitisedActual, sanitisedExpected);
  }

  /**
   * Emits an unhandled error message
   *
   * @private
   * @param {(Error | null)} error The unhandled error (if exists)
   * @memberof TestOutputStream
   */
  private _writeUnhandledErrorOutput(error: Error | null): void {
    this._writeFailure(
      "The test threw an unhandled error.",
      "an unhandled error",
      "no unhandled errors to be thrown",
      error instanceof Error ? error.stack : undefined
    );
  }

  /**
   * Writes a failure message in TAP format
   *
   * @private
   * @param {string} message The message
   * @param {string} actual The actual received value
   * @param {string} expected The expected value
   * @param {string} [stack] The optional stack trace string
   * @memberof TestOutputStream
   */
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
