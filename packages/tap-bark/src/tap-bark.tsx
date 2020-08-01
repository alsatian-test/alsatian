import "./external/tap-parser.d";
import "./external/duplexer.d";
import through from "through2";
import Parser from "tap-parser";
import duplexer from "duplexer";
import React from "react";
import { render } from "ink";
import { TapBarkRoot } from "./components/tap-bark-root";

export class TapBark {
    
    public static readonly tapParser = new Parser();

    public static create(showProgress: boolean = true) {
        const tapBarkOutput = <TapBarkRoot showProgress={showProgress} />;
        render(tapBarkOutput);
        
        return {
            getPipeable: () => duplexer(TapBark.tapParser, through())
        };
    }
}
