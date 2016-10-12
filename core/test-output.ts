import { ITest, ITestFixture } from "./_interfaces";
import { MatchError } from "./_errors";
import { TestCaseResult, TestOutcome } from "./_results";

export class TestOutput {

    private _outStream: NodeJS.ReadableStream;
    private _ended: boolean = false;
    private _messages = [];
    private _curIndex = 0;
    private _currIndex = 0;

    constructor (outStream: NodeJS.ReadableStream) {
        this._outStream = outStream;
        this._outStream._read = () => {
           //console.log("read called");
           if (this._ended) {
             this._outStream.push(null);
          }
          else if (this._messages.length < this._curIndex) {
             this._outStream.push(this._messages[this._curIndex++]);
          }
        }

        this._outStream.on("error", (error) => {
           console.log("stream error", error);
        });
        //this._outStream.readable = true;
         /*this._outStream._read = () => {
            if (this._currIndex === this._messages.length) {
               console.log(this._currIndex, this._messages);
              //this._outStream.push(null);
           }
           else {
              console.log("pushing", this._messages[this._currIndex]);
              this._outStream.push(this._messages[this._currIndex ++])
           }
        }*/
    }

    public end() {
      this._ended = true;
      this._outStream.push(null);
      //this._outStream.emit("end");
      //this._outStream.emit("close");
   }

    private _writeOut(message: string): void {
      //console.log("writing");
      this._messages.push(message);
      if (!this._ended) {
         //this._outStream.emit("readable", true);
         //this._outStream.resume();//.emit("readable");
         this._outStream.push(message);
      }
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
            let yaml = this._getErrorYaml(error);

            this._writeOut(yaml);
        } else {
           error.expectedValue = "the test to run";
           error.actualValue= "the test threw an error";
            this._writeOut(this._getErrorYaml(error));
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

    private _getErrorYaml(error: MatchError): string {
        return " ---\n" +
                "   message: \"" + error.message.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"\n" +
                "   severity: fail\n" +
                "   data:\n" +
                "     got: " + JSON.stringify(error.actualValue) + "\n" +
                "     expect: " + JSON.stringify(error.expectedValue) + "\n ...\n";
    }

}
