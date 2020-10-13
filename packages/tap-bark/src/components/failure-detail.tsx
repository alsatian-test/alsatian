import React from "react";
import { Box, Text } from "ink";

export interface FailureDetailProps {
    name: string;
    value: any;
}

export function FailureDetail(props: FailureDetailProps) {
    const stringValue = JSON.stringify(props.value);

    return <>
            <Text underline>{props.name}:</Text>
            <Box>{stringValue}</Box>
           </>;
}
