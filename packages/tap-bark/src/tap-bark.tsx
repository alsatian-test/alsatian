import { Results } from "./results";
import { Assertion as TAPAssertion, Results as TAPResults, Assertion, Plan } from "./external/tap-parser";
import through from "through2";
import parser from "tap-parser";
import duplexer from "duplexer";
import React, { useState } from "react";
import { render, Color, Text, Box, Static } from "ink";

const TAP_PARSER: { on: (eventName: string, callback: Function) => void } = new parser();

export interface TapBarkOutputProps {
    showProgress: boolean;
}

function getFailureMessage(assertion: Assertion) {

    const failureTitle = <Box><Text bold><Color red>FAIL:</Color> {assertion.name}</Text></Box>;

    if (assertion.diag) {
        const data = assertion.diag.data;
        const details = data.details;
        const title = <Box flexDirection="column">
                        {failureTitle}
                        <Box>{assertion.diag.message}</Box>
                      </Box>;

        if (details && Object.keys(details).length > 0) {
            return (<>
                {title}
                {Object.keys(details)
                    .map((key, index) => <Box padding={1} flexDirection="column" key={`failure-detail-${index}`}>
                                    <Text underline>{key}:</Text>
                                    <Box>{details[key]}</Box>
                                </Box>)}
            </>);
        }

        return <>
                {title}
                <Text underline>expected:</Text>
                <Box>{data.expect}</Box>
                <Text underline>actual:</Text>
                <Box>{data.got}</Box>
               </>;
    }

    return <>{failureTitle}Failure reason unknown.</>;
}

const CONSOLE_WARNING_REGEXP: RegExp = /^# WARN: (.*)/;

export function TapBarkOutputComponent(props: TapBarkOutputProps) {

    const [ warnings, setWarnings ] = useState([]);
    const [ totalTests, setTotalTests ] = useState(0);
    const [ currentTest, setCurrentTest ] = useState(0);
    const [ results, setResults ] = useState<Results>(null);
    const [ complete, setComplete ] = useState(false);
    const [ setup, setSetup ] = useState(false);

    function handleComment(comment: string) {
        const message = comment.replace("# ", "");

        if (CONSOLE_WARNING_REGEXP.test(comment)) {
            setWarnings(previousWarnings => [
                ...previousWarnings,
                <Color yellow key={`warn-${previousWarnings.length}`}>{message}</Color>
            ]);
        }
    }
    
    //TODO: convert this to useEffect however since this is deferred would
    //      need to change getPipeable to async so probably a 4.0.0 thing as is
    //      a breaking change
    (() => {
        if (setup) {
            return;
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
                fail: (r.failures.length || r.fail || (r.failures || []).length),
                ignore: (r.skip || 0) + (r.todo || 0),
                failures: r.failures || []
            });
        });

        setSetup(true);
    })();

    if (results) {

        // ensure only runs once (seems like tap can report complete multiple times)
        if (complete === false) {
            setTimeout(() => process.exit(results.ok ? 0 : 1), 100);        
            setComplete(true);
        }

        return  <>
                    <Static>
                        {warnings}
                        {results.failures.map((assertion, index) => {
                            return <Box key={`failure-${index}`} flexDirection="column">{getFailureMessage(assertion)}</Box>;
                        })}
                    </Static>
                    <Box flexDirection="column" padding={1}>
                        <Color green>Pass: {results.pass} / {totalTests}</Color>
                        <Color red>Fail: {results.fail} / {totalTests}</Color>
                        <Color yellow>Ignore: {results.ignore} / {totalTests}</Color>
                    </Box>
                </>;
    }

    if (props.showProgress === false) {
        return <Text>running alsatian tests</Text>
    }

    return <Text>{Math.floor(currentTest / totalTests * 100 || 0)}% complete</Text>;
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
