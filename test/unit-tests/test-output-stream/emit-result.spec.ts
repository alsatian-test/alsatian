import { ITest } from "../../../core/_interfaces";
import {
   Expect,
   SpyOn,
   SpyOnProperty,
   Test,
   TestCase,
   TestCaseResult,
   TestOutputStream,
   TestSet
} from "../../../core/alsatian-core";

import { TestBuilder } from    "../../builders/test-builder";

import { EqualMatchError, MatchError } from "../../../core/errors";
import { TestSetResults } from "../../../core/results/test-set-results";
import { TestPlan } from "../../../core/running/test-plan";
import { TestSetRunInfo } from "../../../core/running/test-set-run-info";

const _getErrorYaml: (error: MatchError, rl: boolean) => string = (error: MatchError, rl: boolean) => {
    let str =  ` ---\n`
          + `   message: "${error.message.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"\n`
          + `   severity: fail\n`
          + `   data:\n`
          + `     got: ${JSON.stringify(error.actual)}\n`
          + `     expect: ${JSON.stringify(error.expected)}\n`;

    if (rl) {
       if (error.fileName) {
          str += `   file: ${error.fileName}\n`;
       }
       if (error.lineNumber > 0) {
          str += `   line: ${error.lineNumber}\n`;
       }

       if (error.columnNumber > 0) {
          str += `   col: ${error.columnNumber}\n`;
       }
    }

    str += ` ...\n`;
    return str;
};

const _getUnhandledErrorMessage: (stack: string) => string = (stack: string) => {
    return (
        " ---\n" +
        "   message: \"The test threw an unhandled error.\"\n" +
        "   severity: fail\n" +
        "   data:\n" +
        "     got: an unhandled error\n" +
        "     expect: no unhandled errors to be thrown\n" +
        "     stack: |\n" +
        stack.split("\n").map(l => "       " + l).join("\n") + "\n" +
        " ...\n"
    );
};

export class EmitResultTests {

   private getTestOutputStream(reportLocation: boolean): TestOutputStream {
      const testSet = TestSet.create();
      const testSetRunInfo = new TestSetRunInfo(
         new TestPlan(testSet),
         new TestSetResults(),
         500,
         reportLocation);
      let testOutput = new TestOutputStream();
      testOutput.setTestSetRunInfo(testSetRunInfo);
      return testOutput;
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(3)
   public shouldEmitWithCorrectTestId(testId: number) {
      let testOutput = new TestOutputStream();
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().build();

      let testCaseResult = new TestCaseResult(test, [], undefined);

      testOutput.emitResult(testId, testCaseResult);

      let expected = `ok ${testId} ${test.description}\n`;

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @TestCase("test that should pass")
   @TestCase("bla bla bla")
   @TestCase("hello this is a test")
   public shouldEmitWithCorrectTestDescription(description: string) {
      let testOutput = new TestOutputStream();
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder()
      .withDescription(description).build();

      let testCaseResult = new TestCaseResult(test, [], undefined);

      testOutput.emitResult(1, testCaseResult);

      let expected = `ok 1 ${description}\n`;

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @TestCase([ 1, 5, 7, 8 ], "( 1, 5, 7, 8 )")
   @TestCase([ "a", 3, true ], "( \"a\", 3, true )")
   @TestCase([ 5.25, 6.25, 7.22 ], "( 5.25, 6.25, 7.22 )")
   @TestCase([ TypeError, RangeError ], "( TypeError, RangeError )")
   @TestCase([ () => "I am anonymous" ], "( anonymous function )")
   @TestCase([ undefined ], "( undefined )")
   public shouldEmitWithCorrectCaseArguments(testCaseArguments: Array<any>, testCaseOutput: string) {
      let testOutput = new TestOutputStream();
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().build();

      let testCaseResult = new TestCaseResult(test, testCaseArguments, undefined);

      testOutput.emitResult(1, testCaseResult);

      let expected = `ok 1 ${test.description} ${testCaseOutput}\n`;

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @Test()
   public shouldEmitWithOkIfPass() {
      let testOutput = new TestOutputStream();
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().build();

      let testCaseResult = new TestCaseResult(test, [], undefined);

      testOutput.emitResult(1, testCaseResult);

      let expected = `ok 1 ${test.description}\n`;

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @Test()
   public shouldEmitWithNotOkIfPass() {
      let testOutput = new TestOutputStream();
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().build();

      // match error causes a "fail"
      let testCaseResult = new TestCaseResult(test, [], new MatchError("message", 1, 2));

      testOutput.emitResult(1, testCaseResult);

      let expected = `not ok 1 ${test.description}\n`;

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @Test()
   public shouldEmitSkipCorrectly() {
      let testOutput = new TestOutputStream();
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().ignored().build();

      let testCaseResult = new TestCaseResult(test, [], undefined);

      testOutput.emitResult(1, testCaseResult);

      let expected = `ok 1 ${test.description} # skip\n`;

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @TestCase("first reason")
   @TestCase("this reason is the second one!")
   @TestCase("last, but most certainly not least")
   public shouldEmitSkipWithReasonCorrectly(reason: string) {
      let testOutput = new TestOutputStream();
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().ignored(reason).build();

      let testCaseResult = new TestCaseResult(test, [], undefined);

      testOutput.emitResult(1, testCaseResult);

      let expected = `ok 1 ${test.description} # skip ${reason}\n`;

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @Test()
   public shouldEmitErrorCorrectly() {
      let testOutput = new TestOutputStream();
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().build();

      // any error apart from a MatchError causes an "error" outcome
      let testCaseResult = new TestCaseResult(test, [], new Error("an error occured when running the test"));

      testOutput.emitResult(1, testCaseResult);

      let expected = `not ok 1 ${test.description}\n`;

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @TestCase("message one")
   @TestCase("another message")
   @TestCase("yaba daba doo")
   public shouldEmitYamlWithCorrectMessage(message: string) {
      const reportLocation = true;
      const testOutput = this.getTestOutputStream(reportLocation);
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().build();

      let error = new MatchError(message, 1, 2);

      let testCaseResult = new TestCaseResult(test, [], error);

      let expected = _getErrorYaml(error, reportLocation);

      testOutput.emitResult(1, testCaseResult);

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @TestCase(5)
   @TestCase("tweny")
   @TestCase(false)
   public shouldEmitYamlWithCorrectActualValue(actualValue: any) {
      const reportLocation = true;
      const testOutput = this.getTestOutputStream(true);
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().build();

      let error = new EqualMatchError(actualValue, 2, true);

      let testCaseResult = new TestCaseResult(test, [], error);

      let expected = _getErrorYaml(error, reportLocation);

      testOutput.emitResult(1, testCaseResult);

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @TestCase("five")
   @TestCase(20)
   @TestCase(true)
   public shouldEmitYamlWithCorrectExpectedValue(expectedValue: any) {
      const reportLocation = true;
      const testOutput = this.getTestOutputStream(reportLocation);
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().build();

      let error = new EqualMatchError(1, expectedValue, true);

      let testCaseResult = new TestCaseResult(test, [], error);

      let expected = _getErrorYaml(error, reportLocation);

      testOutput.emitResult(1, testCaseResult);

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @TestCase(true)
   @TestCase(false)
   public shouldEmitYamlWithCorrectLocationReport(reportLocation: boolean) {
      const testOutput = this.getTestOutputStream(reportLocation);
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().build();

      let error = new EqualMatchError(1, false, true);

      let testCaseResult = new TestCaseResult(test, [], error);

      let expected = _getErrorYaml(error, reportLocation);

      testOutput.emitResult(1, testCaseResult);

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @TestCase(100)
   @TestCase(42)
   @TestCase(-42)
   public invalidResultOutcomeThrowsError(testOutcome: number) {
      const testCaseResult = <TestCaseResult> { outcome: testOutcome };

      const testOutput = new TestOutputStream();

      Expect(() => testOutput.emitResult(1, testCaseResult))
        .toThrowError(TypeError, `Invalid test outcome: ${testOutcome}`);
   }

   @TestCase("line 1\nline3\nline 7")
   @TestCase("function foo in a.ts\nfunction bar in z.ts\nfunction x in entry.ts")
   public shouldEmitCorrectUnhandledErrorStack(stack: string) {
       let testOutput = new TestOutputStream();
       SpyOn(testOutput, "push");

       let test: ITest = new TestBuilder().build();

       let error = new Error("empty message");
       error.stack = stack;

       let testCaseResult = new TestCaseResult(test, [], error);

       let expected = _getUnhandledErrorMessage(stack);

       testOutput.emitResult(1, testCaseResult);

       Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

   @TestCase([{}])
   @TestCase([{file: "file1"}])
   @TestCase([{line: 1}])
   @TestCase([{col: 1}])
   @TestCase([{file: "aFile"}, {line: 123}])
   @TestCase([{file: "aFile"}, {col: 456}])
   @TestCase([{file: "aFile"}, {line: 123}, {col: 456}])
   public shouldEmitYamlWithCorrectLocationReportContents(contents: Array<any>) {
      const reportLocation = true;
      const testOutput = this.getTestOutputStream(reportLocation);
      SpyOn(testOutput, "push");

      let test: ITest = new TestBuilder().build();

      let error = new EqualMatchError(1, false, true);
      for (let o of contents) {
         if (o.file) { error.fileName = o.file; }
         if (o.line) { error.lineNumber = o.line; }
         if (o.col) { error.columnNumber = o.col; }
      }
      let testCaseResult = new TestCaseResult(test, [], error, true);

      let expected = _getErrorYaml(error, reportLocation);

      testOutput.emitResult(1, testCaseResult);

      Expect(testOutput.push).toHaveBeenCalledWith(expected);
   }

}
