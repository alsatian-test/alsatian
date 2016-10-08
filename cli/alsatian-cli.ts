#! /usr/bin/env node

import { createTestSet } from "../core/alsatian-core";
import { AlsatianCliOptions } from "./alsatian-cli-options";
import * as ChildProcess from "child_process";

const {
  TapBark
} = require("tap-bark");

// get all arguments from the user
const userArguments = new AlsatianCliOptions(process.argv.slice(2));


if (!userArguments.tap) {
   const runnerProcess = ChildProcess.spawn("node", ["./cli/startup.js"].concat(process.argv.slice(2)));

    // otherwise create the tap bark reporter
    const tapBark = TapBark.create();
    // pipe the reporter into stdout
    tapBark.pipe(runnerProcess);
}
else {
   require("./startup");
}
//otherwise get TAP
