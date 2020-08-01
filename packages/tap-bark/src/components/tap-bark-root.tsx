import React, { useState } from "react";
import { Results } from "../results";
import { setupTapParser } from "../setup-tap-parser";
import { TapBarkResults } from "./tap-bark-results";
import { TapBarkProgress } from "./tap-bark-progress";

export interface TapBarkRootProps {
    showProgress: boolean;
}

export function TapBarkRoot(props: TapBarkRootProps) {

    const [ warnings, setWarnings ] = useState<Array<React.ReactElement>>([]);
    const [ totalTests, setTotalTests ] = useState(0);
    const [ currentTest, setCurrentTest ] = useState(0);
    const [ results, setResults ] = useState<Results | null>(null);
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
