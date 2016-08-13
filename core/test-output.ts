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

}
