import { IOutput } from "./output/output.i";
import { IResults } from "./results.i";
import { Stream } from "./stream/stream";
import { Output } from "./output/output";
import { OutputProvider } from "./output-provider/output-provider";

import { Assertion as TAPAssertion, Results as TAPResults } from "./external/tap-parser";
import chalk from "chalk";

const parser = require("tap-parser")();
const duplexer = require("duplexer");
const { h, render, Component, Color, Indent } = require("ink");

class TapBarkOutput extends Component {

    private FIXTURE_REGEXP: RegExp = /# FIXTURE (.*)/g;
    private CONSOLE_ERROR_REGEXP: RegExp = /# ERROR: (.*)/g;
    private CONSOLE_WARNING_REGEXP: RegExp = /# WARN: (.*)/g;
    private _completeCalled = false;

    public constructor() {
        super();
        this.state = {
            logs: []
        };

        this.setupListeners();
    }

    public getResults() {

        const results = this.state.results;
        const total = this.state.totalTests;
        
        return 
            <Indent>
                <Color green>`Pass: ${results.pass} / ${total}\n`)</Color>
                <Color red>`Fail: ${results.fail} / ${total}\n`)</Color>
                <Color yellow>`Ignore: ${results.ignore} / ${total}\n\n`</Color>
                {results.failures.map(this.getFailureMessage.bind(this)).join("\n")}
            </Indent>
    }

    public getFailureMessage(assertion: any): string {

        const failureTitle = chalk.red("FAIL: ") + chalk.bold(assertion.name) + "\n";

        if (assertion.diag) {
            const data = assertion.diag.data;
            const details = data.details;
            const title = `${failureTitle} ${assertion.diag.message}\n`;

            if (details && Object.keys(details).length > 0) {
                return `${title}${
                    Object.keys(details)
                            .map(key => `\n${key}:\n${details[key]}`)
                            .join("\n")
                    }`;
            }

            return `${title}\nexpected:\n${data.expect}\nactual:\n${data.got}`;
        }

        return failureTitle + "Failure reason unknown.";
    }

    public render() {
        const results = this.state.results;
        const total = this.state.totalTests;

        return (
        <Indent>
                {`${Math.floor(this.state.currentTest / total * 100)}\n`}
                {this.state.results && 
                <Indent>
                    <Color green>Pass: {results.pass} / {total}{"\n"}</Color>
                    <Color red>Fail: {results.fail} / {total}{"\n"}</Color>
                    <Color yellow>Ignore: {results.ignore} / {total}{"\n"}{"\n"}</Color>
                    {results.failures.map(this.getFailureMessage.bind(this)).join("\n")}
                </Indent>
                }
            </Indent>);
    }

    private setupListeners(): void {
        parser.on("plan", (plan: any) => {
            this.setState({
                totalTests: plan.end
            });
        });

        parser.on("comment", (comment: string) => {
            let fixtureParse = this.FIXTURE_REGEXP.exec(comment);

            if (fixtureParse !== null) {
                this.setState({
                    fixtureName: fixtureParse[1]
                });
            }
            else {
                // TEMP: DISABLE LOGS
                return;

                const message = comment.replace("# ", "");

                if (this.CONSOLE_ERROR_REGEXP.test(comment)) {
                    this.cachedState.logs = [ ...this.cachedState.logs, chalk.red(message) ];
                }
                else if (this.CONSOLE_WARNING_REGEXP.test(comment)) {
                    this.cachedState.logs = [ ...this.cachedState.logs, chalk.yellow(message) ];
                }
                else {
                    this.cachedState.logs = [ ...this.cachedState.logs, message ];
                }
            }
        });

        parser.on("assert", (assertion: TAPAssertion) => {
            this.setState({
                currentTest: assertion.id,
                testName: assertion.name
            });
        });

        parser.on("complete", (results: TAPResults) => {
            let _results: IResults = {
                pass: results.pass || 0,
                fail: (results.fail || (results.failures || []).length),
                ignore: (results.skip || 0) + (results.todo || 0),
                failures: results.failures || []
            };

            // getting called multiple times for whatever reason
            if (this._completeCalled === false) {
                this._completeCalled = true;
                
                this.setState({
                    ... this.state,
                    results: _results
                }, setTimeout(() => {
                    if (results.ok) {
                        process.exit(0);
                    } else {
                        process.exit(1);
                    }
                }, 100));
            }
        });
    }

}

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
        /*
        const stream = new Stream();
        const input = parser();

        const outputProvider = new OutputProvider();
        const output = new Output(stream, outputProvider);

        return new TapBark(output, input);
        */
        const stream = new Stream();
        render(<TapBarkOutput />);

        return {
            getPipeable(): any {
                return duplexer(parser, stream.getUnderlyingStream());
            }
        }
    }

    public getPipeable(): any {
        return duplexer(this.parser, this.output.getStream().getUnderlyingStream());
    }

    private FIXTURE_REGEXP: RegExp = /# FIXTURE (.*)/g;
    private CONSOLE_ERROR_REGEXP: RegExp = /# ERROR: (.*)/g;
    private CONSOLE_WARNING_REGEXP: RegExp = /# WARN: (.*)/g;

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
            else {
                const message = comment.replace("# ", "");

                if (this.CONSOLE_ERROR_REGEXP.test(comment)) {
                    this.output.outputLog(chalk.red(message));
                }
                else if (this.CONSOLE_WARNING_REGEXP.test(comment)) {
                    this.output.outputLog(chalk.yellow(message));
                }
                else {
                    this.output.outputLog(message);
                }
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
