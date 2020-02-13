import { Results } from "../results";
import { getFailureMessage } from "./get-failure-details";
import React from "react";
import { Box, Static, Color } from "ink";


interface TapBarkResultsProps {
    warnings: Array<React.ReactElement>;
    results: Results;
    totalTests: number;
}

export function TapBarkResults(props: TapBarkResultsProps) {
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
