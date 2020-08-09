import through from "through2";
import duplexer from "duplexer";
import Parser from "tap-parser";
import React from "react";
import { render } from "ink";
import { TapBarkRoot } from "./components/tap-bark-root";
import { Transform } from "stream";

export class TapBark {
    
    public static readonly tapParser: Transform = new Parser();

    public static create(showProgress: boolean = true) {
        const tapBarkOutput = <TapBarkRoot showProgress={showProgress} />;
        render(tapBarkOutput);
        
        return {
            getPipeable: () => duplexer(TapBark.tapParser, through())
        };
    }
}
