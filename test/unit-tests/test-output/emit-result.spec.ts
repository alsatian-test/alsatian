import { Expect, TestCase, Test, SpyOn, FocusTest, TestOutput, TestCaseResult, TestOutcome} from "../../../core/alsatian-core";
import { MatchError, EqualMatchError } from "../../../core/_errors";
import { ITest } from "../../../core/_interfaces";
import { TestBuilder } from "../../builders/test-builder";
import { OutputStreamBuilder } from "../../builders/output-stream-builder";

const _getErrorYaml: (error: MatchError) => string = (error: MatchError) => {
    return  ` ---\n   message: "${error.message.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"\n   severity: fail\n   data:\n     got: ${JSON.stringify(error.actualValue)}\n     expect: ${JSON.stringify(error.expectedValue)}\n ...\n`;
};

export class EmitResultTests {

   @TestCase(1)
   @TestCase(2)
   @TestCase(3)
   public shouldEmitWithCorrectTestId(testId: number) {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder().build();

      let testCaseResult = new TestCaseResult(test, [], undefined);

      testOutput.emitResult(testId, testCaseResult);

      let expected = `ok ${testId} ${test.description}\n`;

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @TestCase("test that should pass")
   @TestCase("bla bla bla")
   @TestCase("hello this is a test")
   public shouldEmitWithCorrectTestDescription(description: string) {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder()
      .withDescription(description).build();

      let testCaseResult = new TestCaseResult(test, [], undefined);

      testOutput.emitResult(1, testCaseResult);

      let expected = `ok 1 ${description}\n`;

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @TestCase([ 1, 5, 7, 8 ], "[ 1, 5, 7, 8 ]")
   @TestCase([ "a", 3, true ], "[ \"a\", 3, true ]")
   @TestCase([ 5.25, 6.25, 7.22 ], "[ 5.25, 6.25, 7.22 ]")
   @TestCase([ TypeError, RangeError ], "[ TypeError, RangeError ]")
   @TestCase([ undefined ], "[ undefined ]")
   public shouldEmitWithCorrectCaseArguments(testCaseArguments: Array<any>, testCaseOutput: string) {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder().build();

      let testCaseResult = new TestCaseResult(test, testCaseArguments, undefined);

      testOutput.emitResult(1, testCaseResult);

      let expected = `ok 1 ${test.description} ${testCaseOutput}\n`;

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @Test()
   public shouldEmitWithOkIfPass() {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder().build();

      let testCaseResult = new TestCaseResult(test, [], undefined);

      testOutput.emitResult(1, testCaseResult);

      let expected = `ok 1 ${test.description}\n`;

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @Test()
   public shouldEmitWithNotOkIfPass() {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder().build();

      // match error causes a "fail"
      let testCaseResult = new TestCaseResult(test, [], new MatchError(1, 2, "message"));

      testOutput.emitResult(1, testCaseResult);

      let expected = `not ok 1 ${test.description}\n`;

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @Test()
   public shouldEmitSkipCorrectly() {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder().ignored().build();

      let testCaseResult = new TestCaseResult(test, [], undefined);

      testOutput.emitResult(1, testCaseResult);

      let expected = `ok 1 ${test.description} # skip\n`;

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @TestCase("first reason")
   @TestCase("this reason is the second one!")
   @TestCase("last, but most certainly not least")
   public shouldEmitSkipWithReasonCorrectly(reason: string) {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder().ignored(reason).build();

      let testCaseResult = new TestCaseResult(test, [], undefined);

      testOutput.emitResult(1, testCaseResult);

      let expected = `ok 1 ${test.description} # skip ${reason}\n`;

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @Test()
   public shouldEmitErrorCorrectly() {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder().build();

      // any error apart from a MatchError causes an "error" outcome
      let testCaseResult = new TestCaseResult(test, [], new Error("an error occured when running the test"));

      testOutput.emitResult(1, testCaseResult);

      let expected = `not ok 1 ${test.description}\n`;

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @TestCase("message one")
   @TestCase("another message")
   @TestCase("yaba daba doo")
   public shouldEmitYamlWithCorrectMessage(message: string) {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder().build();

      let error = new MatchError(1, 2, message);

      let testCaseResult = new TestCaseResult(test, [], error);

      let expected = _getErrorYaml(error);

      testOutput.emitResult(1, testCaseResult);

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @TestCase(5)
   @TestCase("tweny")
   @TestCase(false)
   public shouldEmitYamlWithCorrectActualValue(actualValue: any) {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder().build();

      let error = new EqualMatchError(actualValue, 2, true);

      let testCaseResult = new TestCaseResult(test, [], error);

      let expected = _getErrorYaml(error);

      testOutput.emitResult(1, testCaseResult);

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @TestCase("five")
   @TestCase(20)
   @TestCase(true)
   public shouldEmitYamlWithCorrectExpectedValue(expectedValue: any) {
      let outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      let testOutput = new TestOutput(outStream);

      let test: ITest = new TestBuilder().build();

      let error = new EqualMatchError(1, expectedValue, true);

      let testCaseResult = new TestCaseResult(test, [], error);

      let expected = _getErrorYaml(error);

      testOutput.emitResult(1, testCaseResult);

      Expect(outStream.write).toHaveBeenCalledWith(expected);
   }

   @TestCase(100)
   @TestCase(42)
   @TestCase(-42)
   public invalidResultOutcomeThrowsError(testOutcome: number) {
      const testCaseResult = <TestCaseResult>{ outcome: testOutcome };
      const outStream = new OutputStreamBuilder().build();
      SpyOn(outStream, "write");

      const testOutput = new TestOutput(outStream);

      Expect(() => testOutput.emitResult(1, testCaseResult)).toThrowError(TypeError, `Invalid test outcome: ${testOutcome}`);
   }
}
