import { Results } from "./results";
import { Assertion as TAPAssertion, Results as TAPResults, Assertion, Plan } from "./external/tap-parser";
import chalk from "chalk";

const through = require("through2");
const parser = require("tap-parser");
const duplexer = require("duplexer");
const { h, render, Component, Color, Indent } = require("ink");

const TAP_PARSER: { on: (eventName: string, callback: Function) => void } = parser();

export { Component };
export class TapBarkOutput extends Component {
    
    public getPipeable(): any {
        return duplexer(TAP_PARSER, through());
    }

    private FIXTURE_REGEXP: RegExp = /^# FIXTURE (.*)/;
    private CONSOLE_WARNING_REGEXP: RegExp = /^# WARN: (.*)/;
    private _completeCalled = false;

    public constructor(props) {
        super(props);
        this.state = {
            logs: [],
            warnings: []
        };

        this.setupListeners();
    }

    public getFailureMessage(assertion: Assertion): string {

        const failureTitle = chalk.red("FAIL: ") + chalk.bold(assertion.name) + "\n";

        if (assertion.diag) {
            const data = assertion.diag.data;
            const details = data.details;
            const title = `${failureTitle} ${assertion.diag.message}\n`;

            if (details && Object.keys(details).length > 0) {
                return `${title}${
                    Object.keys(details)
                            .map(key => `\n${chalk.underline(key)}:\n${details[key]}`)
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

        if (this.state.results) {
            return <Indent>
                        {this.state.warnings.join("\n")}
                        <Color green>Pass: {results.pass} / {total}{"\n"}</Color>
                        <Color red>Fail: {results.fail} / {total}{"\n"}</Color>
                        <Color yellow>Ignore: {results.ignore} / {total}{"\n"}{"\n"}</Color>
                        {results.failures.map(this.getFailureMessage.bind(this)).join("\n")}
                    </Indent>;
        }

        if (this.props.showProgress === false) {
            return <Indent>running alsatian tests</Indent>
        }

        return <Indent>{Math.floor(this.state.currentTest / total * 100 || 0)}% complete</Indent>;
    }

    private handleNewPlan(plan: Plan) {
        this.setState({
            totalTests: plan.end
        });
    }

    // temporary while https://github.com/vadimdemedes/ink/issues/97 is still an issue
    private readonly warnings = [] as Array<string>;

    private handleComment(comment: string) {
        let fixtureParse = this.FIXTURE_REGEXP.exec(comment);

        if (fixtureParse !== null) {
            this.setState({
                fixtureName: fixtureParse[1]
            });
        }
        else {
            const message = comment.replace("# ", "");

            if (this.CONSOLE_WARNING_REGEXP.test(comment)) {
                
                // temporary while https://github.com/vadimdemedes/ink/issues/97 is still an issue
                this.warnings.push(chalk.yellow(message));
                this.setState({
                    warnings: this.warnings
                });
            }
        }
    }

    private handleAssert(assertion: TAPAssertion) {
        this.setState({
            currentTest: assertion.id,
            testName: assertion.name
        });
    }

    private handleComplete(results: TAPResults) {
        let _results: Results = {
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
    }

    private setupListeners(): void {
        if (this.props.showProgress) {
            TAP_PARSER.on("comment", this.handleComment.bind(this));
            TAP_PARSER.on("assert", this.handleAssert.bind(this));
        }
        
        TAP_PARSER.on("plan", this.handleNewPlan.bind(this));
        TAP_PARSER.on("complete", this.handleComplete.bind(this));
    }
}

export class TapBark {
    
    public static readonly tapParser = TAP_PARSER;

    public static create(showProgress: boolean = true): TapBarkOutput {
        const tapBarkOutput = <TapBarkOutput showProgress={showProgress} />;
        render(tapBarkOutput);
        return tapBarkOutput.instance;
    }
}
