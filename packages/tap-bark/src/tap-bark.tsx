import { Results } from "./results";
import { Assertion as TAPAssertion, Results as TAPResults, Assertion, Plan } from "./external/tap-parser";
import chalk from "chalk";
import through from "through2";
import parser from "tap-parser";
import duplexer from "duplexer";
import React, { useState } from "react";
import { render, Color } from "ink";

const TAP_PARSER: { on: (eventName: string, callback: Function) => void } = parser();

export interface TapBarkOutputProps {
    showProgress: boolean;
}

const CONSOLE_WARNING_REGEXP: RegExp = /^# WARN: (.*)/;

export function TapBarkOutputComponent(props: TapBarkOutputProps) {

    const [ warnings, setWarnings ] = useState([]);
    const [ totalTests, setTotalTests ] = useState(0);
    const [ currentTest, setCurrentTest ] = useState(0);
    const [ results, setResults ] = useState<Results>(null);
    const [ complete, setComplete ] = useState(false);

    function handleComment(comment: string) {
        const message = comment.replace("# ", "");

        if (CONSOLE_WARNING_REGEXP.test(comment)) {
            setWarnings([
                ...warnings,
                chalk.yellow(message)
            ]);
        }
    }
    
    if (props.showProgress) {
        TAP_PARSER.on("comment", handleComment);
        TAP_PARSER.on("assert", (assertion: TAPAssertion) => setCurrentTest(assertion.id));
    }
    
    TAP_PARSER.on("plan", (plan: Plan) => setTotalTests(plan.end));
    TAP_PARSER.on("complete", (r: TAPResults) => {
        setResults({
            ok: r.ok,
            pass: r.pass || 0,
            fail: (r.fail || (r.failures || []).length),
            ignore: (r.skip || 0) + (r.todo || 0),
            failures: r.failures || []
        });
    });

    function getFailureMessage(assertion: Assertion): string {

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

    if (results) {

        // ensure only runs once (seems like tap can report complete multiple times)
        if (complete === false) {
            setTimeout(() => process.exit(results.ok ? 0 : 1), 100);        
            setComplete(true);
        }

        return <>
                    {warnings.join("\n")}
                    {results.failures.map(getFailureMessage).join("\n")}
                    {"\n"}
                    <Color green>Pass: {results.pass} / {totalTests}{"\n"}</Color>
                    <Color red>Fail: {results.fail} / {totalTests}{"\n"}</Color>
                    <Color yellow>Ignore: {results.ignore} / {totalTests}{"\n"}{"\n"}</Color>
                </>;
    }

    if (props.showProgress === false) {
        return <>running alsatian tests</>
    }

    return <>{Math.floor(currentTest / totalTests * 100 || 0)}% complete</>;
}

export class TapBark {
    
    public static readonly tapParser = TAP_PARSER;

    public static create(showProgress: boolean = true) {
        const tapBarkOutput = <TapBarkOutputComponent showProgress={showProgress} />;
        render(tapBarkOutput);
        
        return {
            getPipeable: () => duplexer(TAP_PARSER, through())
        };
    }
}
