export class TestOutput {

    private _outStream: NodeJS.WritableStream;
    private _errorStream: NodeJS.WritableStream;

    constructor (outStream: NodeJS.WritableStream, errorStream: NodeJS.WritableStream) {
        this._outStream = outStream;
        this._errorStream = errorStream;
    }

    private _writeOut(message: string): void {
        this._outStream.write(message);
    }

    private _writeError(message: string): void {
        this._errorStream.write(message);
    }

    public emitVersion(): void {
        this._writeOut("TAP version 13\n");
    }

    public emitPlan(testCount: number): void {
        this._writeOut(`1..${testCount}\n`);
    }

}
