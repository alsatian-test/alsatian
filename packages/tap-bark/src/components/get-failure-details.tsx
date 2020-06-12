import { TapAssertion } from "../external/tap-parser";
import React from "react";
import { Color, Box, Text } from "ink";
import { FailureDetail } from "./failure-detail";

export function getFailureMessage(assertion: TapAssertion) {

    const failureTitle = <Box><Text bold><Color red>FAIL:</Color> {assertion.name}</Text></Box>;

    if (assertion.diag) {
        const data = assertion.diag.data;
        const details = data.details;
        const title = <Box flexDirection="column">
                        {failureTitle}
                        <Box>at: {assertion.diag.data.fileLocation}</Box>
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
