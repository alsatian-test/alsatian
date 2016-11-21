import { ITest, ITestFixture } from "./_interfaces";
import { MatchError } from "./_errors";
import { TestCaseResult, TestOutcome } from "./_results";
import { Readable as ReadableStream } from "stream";

export class TestOutputStream extends ReadableStream {

   public _read() { }

   public end() {
      this.push(null);
   }

   private _writeOut(message: string): void {
      this.push(message);
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
      let outcome = result.outcome;
      let test = result.test;
      let testCaseArguments = result.arguments;

      if (outcome === TestOutcome.Pass) {
         this._emitPass(testId, test, testCaseArguments);
      } else if (outcome === TestOutcome.Fail || outcome === TestOutcome.Error) {
         let error = result.error;

         this._emitFail(testId, test, testCaseArguments, error);
      } else if (outcome === TestOutcome.Skip) {
         this._emitSkip(testId, test, testCaseArguments);
      } else {
         throw new TypeError(`Invalid test outcome: ${outcome}`);
      }
   }

   private _emitPass(testId: number, test: ITest, testCaseArguments: Array<any>): void {
      let description = this._getTestDescription(test, testCaseArguments);

      this._writeOut(`ok ${testId} ${description}\n`);
   }

   private _emitSkip(testId: number, test: ITest, testCaseArguments: Array<any>): void {
      let description = this._getTestDescription(test, testCaseArguments);

      // we only want to use the reason if it's not undefined
      let reasonString = "";

      if (test.ignoreReason !== undefined) {
         reasonString = ` ${test.ignoreReason}`;
      }

      this._writeOut(`ok ${testId} ${description} # skip${reasonString}\n`);
   }

   private _emitFail(testId: number, test: ITest, testCaseArguments: Array<any>, error: Error): void {
      let description = this._getTestDescription(test, testCaseArguments);

      this._writeOut(`not ok ${testId} ${description}\n`);

      if (error instanceof MatchError) {
          this._writeMatchErrorOutput(<MatchError>error);

          //error = new MatchError("the test threw an error", "the test to run", "Test threw " + (<any>error.constructor).name + " with message \"" + error.message + "\"");
      } else {
          this._writeUnhandledErrorOutput(error);
      }
   }

   private _getTestDescription(test: ITest, testCaseArguments: Array<any>): string {
      let testDescription = test.description;

      if (testCaseArguments !== undefined && testCaseArguments.length > 0) {
         testDescription += ` [ ${testCaseArguments.map(argument => this._getArgumentDescription(argument)).join(", ")} ]`;
      }

      return testDescription;
   }

   private _getArgumentDescription(argument: any): string {

      const jsonArgument = JSON.stringify(argument);

      // if the argument can be expresed as JSON return that
      if (jsonArgument) {
         return JSON.stringify(argument);
      }
      // otherwise if it's a function return it's name
      else if (argument && argument.name) {
         return argument.name;
      }
      else if (argument instanceof Function) {
         return "anonymous function";
      }

      // otherwise must be undefined
      return "undefined";
   }

   private _writeMatchErrorOutput(error: MatchError): void {

       let sanitisedMessage = error.message.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
       let sanitisedActual = JSON.stringify(error.actualValue);
       let sanitisedExpected = JSON.stringify(error.expectedValue);

       this._writeFailure(sanitisedMessage, sanitisedActual, sanitisedExpected);

   }

   private _writeUnhandledErrorOutput(error: Error): void {

       this._writeFailure("The test threw an unhandled error.", "an unhandled error", "no unhandled errors to be thrown", error.stack);

   }

   private _writeFailure(message: string, actual: string, expected: string, stack?: string): void {

       let output =
           " ---\n" +
           "   message: \"" + message + "\"\n" +
           "   severity: fail\n" +
           "   data:\n" +
           "     got: " + actual + "\n" +
           "     expect: " + expected + "\n";

       if (stack) {
           // encode the stack trace with base64 to prevent new lines from messing with the YAML
           output = output + "     stack_base64: " + new Buffer(stack).toString('base64') + "\n";
       }

       output = output + " ...\n";

       this._writeOut(output);
   }

}
