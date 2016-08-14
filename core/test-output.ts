import { ITest } from "./_interfaces/test.i";
import { MatchError } from "./_errors";
import { TestCaseResult } from "./_results";

export class TestOutput {

    private _outStream: NodeJS.WritableStream;

    constructor (outStream: NodeJS.WritableStream) {
        this._outStream = outStream;
    }

    private _writeOut(message: string): void {
        this._outStream.write(message);
    }

    public emitVersion(): void {
        this._writeOut("TAP version 13\n");
    }

    public emitPlan(testCount: number): void {
        this._writeOut(`1..${testCount}\n`);
    }

    public emitResult(testId: number, result: TestCaseResult): void {

    }

    public emitPass(testId: number, test: ITest, testCaseArguments: Array<any>): void {
        let description = this._getTestDescription(test, testCaseArguments);

        this._writeOut(`ok ${testId} ${description}\n`);
    }

    public emitFail(testId: number, test: ITest, testCaseArguments: Array<any>, error: Error): void {
        let description = this._getTestDescription(test, testCaseArguments);

        this._writeOut(`not ok ${testId} ${description}\n`);

        if (error instanceof MatchError) {
            let yaml = this._getErrorYaml(error);

            this._writeOut(yaml);
        } else if (error !== undefined) {
            console.log(error);

            this._writeOut("# Unknown Error\n");
        }

    }

    private _getTestDescription(test: ITest, testCaseArguments: Array<any>): string {
        let testDescription = `${test.ignored ? "# skip " : ""}${test.description}`;

        if (testCaseArguments !== undefined) {
            testDescription += ` [ ${testCaseArguments.map(x => JSON.stringify(x) || "undefined").join(", ")} ]`;
        }

        return testDescription;
    }

    private _getErrorYaml(error: MatchError): string {
        return ` ---\n   message: "${error.message}"\n   severity: fail\n   data:\n     got: ${JSON.stringify(error.actualValue)}\n     expect: ${JSON.stringify(error.expectedValue)}\n ...\n`;
    }

}
