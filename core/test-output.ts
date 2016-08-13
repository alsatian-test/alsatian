import { ITest } from "./_interfaces/test.i";

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

    public emitPass(testId: number, test: ITest, testCaseArguments: Array<any>): void {
        let description = this._getTestDescription(test, testCaseArguments);

        let out = `ok ${testId} ${description}\n`;

        console.log(out);

        this._writeOut(`ok ${testId} ${description}\n`);
    }

    private _getTestDescription(test: ITest, testCaseArguments: Array<any>): string {
        let testDescription = `${test.ignored ? "# skip " : ""}${test.description}`;

        if (testCaseArguments !== undefined) {
            testDescription += ` [ ${testCaseArguments.map(x => JSON.stringify(x) || "undefined").join(", ")} ]`;
        }

        return testDescription;
    }

}
