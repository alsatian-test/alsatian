import React, { useState } from "react";
import { Color } from "ink";
import { TapBark } from "./tap-bark";
import { Plan, TapResults, TapAssertion } from "tap-parser";
import { Results } from "./results";

const CONSOLE_WARNING_REGEXP: RegExp = /^# WARN: (.*)/;

export function setupTapParser(
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
        TapBark.tapParser.on("comment", (comment: string) => {
            const message = comment.replace("# ", "");
        
            if (CONSOLE_WARNING_REGEXP.test(comment)) {
                callbacks.setWarnings(previousWarnings => [
                    ...previousWarnings,
                    <Color yellow key={`warn-${previousWarnings.length}`}>{message}</Color>
                ]);
            }
        });
        TapBark.tapParser.on("assert", (assertion: TapAssertion) => callbacks.setCurrentTest(assertion.id));
    }
    
    TapBark.tapParser.on("plan", (plan: Plan) => callbacks.setTotalTests(plan.end));
    TapBark.tapParser.on("complete", (r: TapResults) => {
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
