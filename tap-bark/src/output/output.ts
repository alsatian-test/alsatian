import { IStream } from "../stream/stream.i";
import { IOutputProvider } from "../output-provider/output-provider.i";
import { IResults } from "../results.i";
import { ResultType } from "../result-type";

export class Output {

    private _stream: IStream;
    private _outputProvider: IOutputProvider;

    constructor(stream: IStream, outputProvider: IOutputProvider) {
        this._stream = stream;
        this._outputProvider = outputProvider;
    }

    public setup(): void {
        // set up the two empty lines to hold fixture info and test case info
        this._stream.writeLine("");
        this._stream.writeLine("");
    }

    public setFixtureName(name: string): void {
        // move up two rows
        this._stream.moveCursor(0, -3);

        // clear the line
        this._stream.clearLine();

        // write the new name
        this._stream.write(name);

        // move down two rows
        this._stream.moveCursor(0, 3);

        // set the cursor to 0 x (all the way left), we don't want to move it up or down
        this._stream.cursorTo(0, undefined);
    }

    public setTestName(name: string): void {
        // move up one rows
        this._stream.moveCursor(0, -2);

        // clear the line
        this._stream.clearLine();

        // write the new name
        this._stream.write(name);

        // move down one rows
        this._stream.moveCursor(0, 2);

        // set the cursor to 0 x (all the way left), we don't want to move it up or down
        this._stream.cursorTo(0, undefined);
    }

    public setProgress(current: number, total: number): void {
        // move up three rows
        this._stream.moveCursor(0, -1);

        // clear the line
        this._stream.clearLine();

        let progressBar = "";

        const progressResolution = 20;

        const progressGap = Math.round(current / total * progressResolution);

        while (progressBar.length < progressGap) {
           progressBar += "=";
        }

        while (progressBar.length < progressResolution) {
           progressBar += " ";
        }

        // write the new name
        this._stream.write("|" + progressBar + "|");

        // move down three rows
        this._stream.moveCursor(0, 1);

        // set the cursor to 0 x (all the way left), we don't want to move it up or down
        this._stream.cursorTo(0, undefined);
    }

    public outputLog(message: string) {
        this._stream.writeLine(message);
    }

    public outputResults(results: IResults): void {
        let total = results.pass + results.fail + results.ignore;

        this._stream.writeLine("");
        this._stream.writeLine(this._outputProvider.getResultMessage(ResultType.PASS, results.pass, total));
        this._stream.writeLine(this._outputProvider.getResultMessage(ResultType.FAIL, results.fail, total));
        this._stream.writeLine(this._outputProvider.getResultMessage(ResultType.IGNORE, results.ignore, total));

        if (results.failures) {
            results.failures.forEach(f => {
                this._stream.writeLine("");
                this._stream.writeLine(this._outputProvider.getFailureMessage(f));
            });
        }
    }

    public getStream(): IStream {
        return this._stream;
    }

}
