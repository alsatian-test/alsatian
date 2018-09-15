import { Test, TestCase, Expect, SpyOn } from "alsatian";
import { OutputProviderBuilder } from "../../../_builders/output-provider-builder";
import { ResultType } from "../../../../src/result-type";
import { Assertion } from "../../../../src/external/tap-parser";
const chalk = require("chalk");

export class GetFailureMessageTests {

    @TestCase("Some failing test", "something went really wrong", "null", "undefined")
    @TestCase("Another failing test", "this should have happened but it didn't", "should have happened", "it didn't")
    @TestCase("Number test", "expected 1 to be 3.", "1", "3")
    public shouldReturnCorrectMessage(name: string, message: string, expect: string, got: string) {
        let provider = new OutputProviderBuilder().build();

        let assertion: Assertion = {
            id: 0,
            ok: false,
            name: name,
            diag: {
                message: message,
                data: {
                   expect: expect,
                   got: got
                }
            }
        };

        let expected = chalk.red("FAIL: ") + chalk.bold(name) + "\n" + message + "\nExpected: " + expect + "\n  Actual: " + got;
        let actual = provider.getFailureMessage(assertion);

        Expect(actual).toBe(expected);
    }

    @TestCase("some stack")
    @TestCase("some other stack")
    public shouldReturnMessageWithCorrectStack(stack: string) {
        let provider = new OutputProviderBuilder().build();

        let name = "test";
        let message = "bla bla";
        let expect = "good";
        let got = "evil";

        let assertion: Assertion = {
            id: 0,
            ok: false,
            name: name,
            diag: {
                message: message,
                data: {
                   expect: expect,
                   got: got,
                   stack: stack
                }
            }
        };

        let expected =
            chalk.red("FAIL: ") + chalk.bold(name) + "\n"
            + message + "\n"
            + "Expected: " + expect + "\n"
            + "  Actual: " + got + "\n"
            + "=====\n"
            + chalk.bold.white("Stack Trace") + "\n\n"
            + stack + "\n"
            + "=====";

        let actual = provider.getFailureMessage(assertion);

        Expect(actual).toBe(expected);
    }

    @TestCase("Some failing test")
    @TestCase("Another failing test")
    @TestCase("Number test")
    public shouldReturnUnknownMessageWithMissingDiag(name: string) {
        let provider = new OutputProviderBuilder().build();

        let assertion: Assertion = {
            id: 0,
            ok: false,
            name: name
        };

        let expected = chalk.red("FAIL: ") + chalk.bold(name) + "\nFailure reason unknown.";
        let actual = provider.getFailureMessage(assertion);

        Expect(actual).toBe(expected);
    }

}
