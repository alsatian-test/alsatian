import { Test, TestCase, Expect, SpyOn } from "alsatian";
import { OutputProviderBuilder } from "../../../_builders/output-provider-builder";
import { ResultType } from "../../../../src/result-type";
import { Assertion } from "../../../../src/external/tap-parser";
const chalk = require("chalk");

export class GetFailureMessageTests {
  @TestCase(
    "Some failing test",
    "something went really wrong",
    "null",
    "undefined"
  )
  @TestCase(
    "Another failing test",
    "this should have happened but it didn't",
    "should have happened",
    "it didn't"
  )
  @TestCase("Number test", "expected 1 to be 3.", "1", "3")
  public shouldReturnCorrectMessage(
    name: string,
    message: string,
    expect: string,
    got: string
  ) {
    const provider = new OutputProviderBuilder().build();

    const assertion: Assertion = {
      id: 0,
      ok: false,
      name,
      diag: {
        message,
        data: {
          expect,
          got
        }
      }
    };

    const expected =
      chalk.red("FAIL: ") +
      chalk.bold(name) +
      "\n" +
      message +
      "\nExpected: " +
      expect +
      "\n  Actual: " +
      got;
    const actual = provider.getFailureMessage(assertion);

    Expect(actual).toBe(expected);
  }

  @TestCase("some stack")
  @TestCase("some other stack")
  public shouldReturnMessageWithCorrectStack(stack: string) {
    const provider = new OutputProviderBuilder().build();

    const name = "test";
    const message = "bla bla";
    const expect = "good";
    const got = "evil";

    const assertion: Assertion = {
      id: 0,
      ok: false,
      name,
      diag: {
        message,
        data: {
          expect,
          got,
          stack
        }
      }
    };

    const expected =
      chalk.red("FAIL: ") +
      chalk.bold(name) +
      "\n" +
      message +
      "\n" +
      "Expected: " +
      expect +
      "\n" +
      "  Actual: " +
      got +
      "\n" +
      "=====\n" +
      chalk.bold.white("Stack Trace") +
      "\n\n" +
      stack +
      "\n" +
      "=====";

    const actual = provider.getFailureMessage(assertion);

    Expect(actual).toBe(expected);
  }

  @TestCase("Some failing test")
  @TestCase("Another failing test")
  @TestCase("Number test")
  public shouldReturnUnknownMessageWithMissingDiag(name: string) {
    const provider = new OutputProviderBuilder().build();

    const assertion: Assertion = {
      id: 0,
      ok: false,
      name
    };

    const expected =
      chalk.red("FAIL: ") + chalk.bold(name) + "\nFailure reason unknown.";
    const actual = provider.getFailureMessage(assertion);

    Expect(actual).toBe(expected);
  }
}
