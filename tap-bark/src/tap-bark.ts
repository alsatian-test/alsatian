import { IOutput } from "./output/output.i";
import { IResults } from "./results.i";
import { IStream } from "./stream/stream.i";
import { IOutputProvider } from "./output-provider/output-provider.i";
import { Stream } from "./stream/stream";
import { Output } from "./output/output";
import { OutputProvider } from "./output-provider/output-provider";

import { Assertion as TAPAssertion, Results as TAPResults } from "./external/tap-parser";

const parser = require("tap-parser");
const duplexer = require("duplexer");

export class TapBark {

    private output: IOutput;
    private parser: NodeJS.EventEmitter;
    private _planEnd = 0;

    constructor (output: IOutput, parser: NodeJS.EventEmitter) {
        this.output = output;
        this.parser = parser;

        this.setupListeners();

        this.output.setup();
    }

    public static create(): any {
        const stream = new Stream();
        const input = parser();

        const outputProvider = new OutputProvider();
        const output = new Output(stream, outputProvider);

        return new TapBark(output, input);
    }

    public getPipeable(): any {
        return duplexer(this.parser, this.output.getStream().getUnderlyingStream());
    }

    private FIXTURE_REGEXP: RegExp = /# FIXTURE (.*)/g;

    // these three functions are needed because tap-parser doesn't always emit a value
    // see tap-parser#40 on github
    private getPassCount = (results: TAPResults) => (results.pass || 0);
    private getFailCount = (results: TAPResults) => (results.fail || (results.failures || []).length);
    private getIgnoreCount = (results: TAPResults) => (results.skip || 0) + (results.todo || 0);

    private setupListeners(): void {
      this.parser.on("plan", (plan: any) => {
         this._planEnd = plan.end;
      });

        this.parser.on("comment", (comment: string) => {
            let fixtureParse = this.FIXTURE_REGEXP.exec(comment);

            if (fixtureParse !== null) {
                this.output.setFixtureName(fixtureParse[1]);
            }
        });

        this.parser.on("assert", (assertion: TAPAssertion) => {
            this.output.setTestName(assertion.name);
            this.output.setProgress(assertion.id, this._planEnd);
        });

        this.parser.on("complete", (results: TAPResults) => {
            let _results: IResults = {
                pass: this.getPassCount(results),
                fail: this.getFailCount(results),
                ignore: this.getIgnoreCount(results),
                failures: results.failures || []
            };

            this.output.outputResults(_results);

            if (results.ok) {
                process.exit(0);
            } else {
                process.exit(1);
            }
        });
    }
}
