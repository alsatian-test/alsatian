import { Expect, TestCase, Test, SpyOn, FocusTest } from "../../../core/alsatian-core";
import { TestCaseResult, TestOutcome } from "../../../core/_results";
import { ITest } from "../../../core/_interfaces/test.i";
import { TestBuilder } from "../../builders/test-builder";
import { getDummyStream } from "./_utils";
import { TestOutput } from "../../../core/test-output";
import { MatchError } from "../../../core/errors/match-error";

export class EmitResultTests {

    private static _getErrorYaml(error: MatchError): string {
        return  ` ---\n   message: "${error.message}"\n   severity: fail\n   data:\n     got: ${JSON.stringify(error.actualValue)}\n     expect: ${JSON.stringify(error.expectedValue)}\n ...\n`;
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(3)
    public shouldEmitWithCorrectTestId(testId: number) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        let testCaseResult = new TestCaseResult(test, [], undefined);
        SpyOn(testCaseResult, "getOutcome").andReturn(TestOutcome.Pass);

        testOutput.emitResult(testId, testCaseResult);

        let expected = `ok ${testId} ${test.description}\n`;

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

    @TestCase("test that should pass")
    @TestCase("bla bla bla")
    @TestCase("hello this is a test")
    public shouldEmitWithCorrectTestDescription(description: string) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder()
            .withDescription(description).build();

        let testCaseResult = new TestCaseResult(test, [], undefined);
        SpyOn(testCaseResult, "getOutcome").andReturn(TestOutcome.Pass);

        testOutput.emitResult(1, testCaseResult);

        let expected = `ok 1 ${description}\n`;

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

    @TestCase([ 1, 5, 7, 8 ], "[ 1, 5, 7, 8 ]")
    @TestCase([ "a", 3, true ], "[ \"a\", 3, true ]")
    @TestCase([ 5.25, 6.25, 7.22 ], "[ 5.25, 6.25, 7.22 ]")
    public shouldEmitWithCorrectCaseArguments(testCaseArguments: Array<any>, testCaseOutput: string) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        let testCaseResult = new TestCaseResult(test, testCaseArguments, undefined);
        SpyOn(testCaseResult, "getOutcome").andReturn(TestOutcome.Pass);

        testOutput.emitResult(1, testCaseResult);

        let expected = `ok 1 ${test.description} ${testCaseOutput}\n`;

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

    @Test()
    public shouldEmitWithOkIfPass() {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        let testCaseResult = new TestCaseResult(test, [], undefined);
        SpyOn(testCaseResult, "getOutcome").andReturn(TestOutcome.Pass);

        testOutput.emitResult(1, testCaseResult);

        let expected = `ok 1 ${test.description}\n`;

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

    @Test()
    public shouldEmitWithNotOkIfPass() {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        let testCaseResult = new TestCaseResult(test, [], undefined);
        SpyOn(testCaseResult, "getOutcome").andReturn(TestOutcome.Fail);

        testOutput.emitResult(1, testCaseResult);

        let expected = `not ok 1 ${test.description}\n`;

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

    @TestCase("message one")
    @TestCase("another message")
    @TestCase("yaba daba doo")
    public shouldEmitYamlWithCorrectMessage(message: string) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        let error = new MatchError(1, 2, message);

        let testCaseResult = new TestCaseResult(test, [], error);
        SpyOn(testCaseResult, "getOutcome").andReturn(TestOutcome.Fail);

        let expected = EmitResultTests._getErrorYaml(error);

        testOutput.emitResult(1, testCaseResult);

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

    @TestCase(5)
    @TestCase("tweny")
    @TestCase(false)
    public shouldEmitYamlWithCorrectActualValue(actualValue: any) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        let error = new MatchError(actualValue, 2, "error message");

        let testCaseResult = new TestCaseResult(test, [], error);
        SpyOn(testCaseResult, "getOutcome").andReturn(TestOutcome.Fail);

        let expected = EmitResultTests._getErrorYaml(error);

        testOutput.emitResult(1, testCaseResult);

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

    @TestCase("five")
    @TestCase(20)
    @TestCase(true)
    public shouldEmitYamlWithCorrectExpectedValue(expectedValue: any) {
        let outStream = getDummyStream();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let test: ITest = new TestBuilder().build();

        let error = new MatchError(1, expectedValue, "error message");

        let testCaseResult = new TestCaseResult(test, [], error);
        SpyOn(testCaseResult, "getOutcome").andReturn(TestOutcome.Fail);

        let expected = EmitResultTests._getErrorYaml(error);

        testOutput.emitResult(1, testCaseResult);

        Expect(outStream.write).toHaveBeenCalledWith(expected);
    }

}
