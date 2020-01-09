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
                                    <FailureDetail name={key} value={details[key]} />
                                </Box>)}
            </>);
        }

        return <>
                {title}
                <FailureDetail name="expected" value={data.expect} />
                <FailureDetail name="actual" value={data.got} />
               </>;
    }

    return <>{failureTitle}Failure reason unknown.</>;
}

interface FailureDetailProps {
    name: string;
    value: string;
}

function FailureDetail(props: FailureDetailProps) {
    return <>
            <Text underline>{props.name}:</Text>
            <Box>{props.value}</Box>
           </>;
}

function setupTapParser(
    showProgress: boolean,
    callbacks: {
        setCurrentTest: (id: number) => void,
        setTotalTests: (id: number) => void,
        setWarnings: React.Dispatch<React.SetStateAction<React.ReactElement[]>>,
        setResults: (result: Results) => void
    }) {
    const [ setup, setSetup ] = useState(false);
    if (setup) return;

    if (showProgress) {
        TAP_PARSER.on("comment", (comment: string) => {
            const message = comment.replace("# ", "");
        
            if (CONSOLE_WARNING_REGEXP.test(comment)) {
                callbacks.setWarnings(previousWarnings => [
                    ...previousWarnings,
                    <Color yellow key={`warn-${previousWarnings.length}`}>{message}</Color>
                ]);
            }
        });
        TAP_PARSER.on("assert", (assertion: TAPAssertion) => callbacks.setCurrentTest(assertion.id));
    }
    
    TAP_PARSER.on("plan", (plan: Plan) => callbacks.setTotalTests(plan.end));
    TAP_PARSER.on("complete", (r: TAPResults) => {
        callbacks.setResults({
            ok: r.ok,
            pass: r.pass || 0,
            fail: r.fail || (r.failures || []).length,
            ignore: (r.skip || 0) + (r.todo || 0),
            failures: r.failures || []
        });
    });

    setSetup(true);
}

const CONSOLE_WARNING_REGEXP: RegExp = /^# WARN: (.*)/;

export function TapBarkOutputComponent(props: TapBarkOutputProps) {

    const [ warnings, setWarnings ] = useState([]);
    const [ totalTests, setTotalTests ] = useState(0);
    const [ currentTest, setCurrentTest ] = useState(0);
    const [ results, setResults ] = useState<Results>(null);
    const [ complete, setComplete ] = useState(false);
    
    //TODO: convert this to useEffect however since this is deferred would
    //      need to change getPipeable to async so probably a 4.0.0 thing as is
    //      a breaking change
    setupTapParser(
        props.showProgress,
        {
            setCurrentTest,
            setTotalTests,
            setWarnings,
            setResults
        }
    );

    if (results) {
        // ensure only runs once (seems like tap can report complete multiple times)
        //TODO: confirm the above is still true
        if (complete === false) {
            setTimeout(() => process.exit(results.ok ? 0 : 1), 100);        
            setComplete(true);
        };

        return <TapBarkResults {... { results, totalTests, warnings }} />;
    }

    return <TapBarkProgress showProgress={props.showProgress} {... { currentTest, totalTests }}/>;
}

interface TapBarkResultsProps {
    warnings: Array<React.ReactElement>;
    results: Results;
    totalTests: number;
}

function TapBarkResults(props: TapBarkResultsProps) {
    const { warnings, results, totalTests } = props;

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

interface TapBarkProgressProps {
    showProgress: boolean;
    currentTest: number;
    totalTests: number;
}

function TapBarkProgress(props: TapBarkProgressProps) {
    if (props.showProgress === false) {
        return <Text>running alsatian tests</Text>
    }

    return <Text>{Math.floor(props.currentTest / props.totalTests * 100 || 0)}% complete</Text>;
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
