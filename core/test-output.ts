export class TestOutput {

    private _outStream: NodeJS.WritableStream;
    private _errStream: NodeJS.WritableStream;

    constructor (outStream: NodeJS.WritableStream, errStream: NodeJS.WritableStream) {
        this._outStream = outStream;
        this._errStream = errStream;
    }

    public emitVersion(): void {
        this._outStream.write("TAP version 13\n");
    }

}
