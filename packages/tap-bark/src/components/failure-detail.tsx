import React from "react";
import { Box, Text } from "ink";

export interface FailureDetailProps {
    name: string;
    value: string;
}

export function FailureDetail(props: FailureDetailProps) {
    return <>
            <Text underline>{props.name}:</Text>
            <Box>{props.value}</Box>
           </>;
}
