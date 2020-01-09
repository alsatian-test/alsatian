import React from "react";
import { Text } from "ink";

export interface TapBarkProgressProps {
    showProgress: boolean;
    currentTest: number;
    totalTests: number;
}

export function TapBarkProgress(props: TapBarkProgressProps) {
    if (props.showProgress === false) {
        return <Text>running alsatian tests</Text>
    }

    return <Text>{Math.floor(props.currentTest / props.totalTests * 100 || 0)}% complete</Text>;
}
