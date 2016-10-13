#! /usr/bin/env node

import { createTestSet, TestRunner, TestOutputStream } from "../core/alsatian-core";
import { CliTestRunner } from "./cli-test-runner";
import { AlsatianCliOptions } from "./alsatian-cli-options";
import { Writable, Readable } from "stream";

const {
   TapBark
} = require("tap-bark");

// get all arguments from the user
let userArguments = new AlsatianCliOptions(process.argv.slice(2));

// create test set from given file globs
let testSet = createTestSet();
testSet.addTestsFromFiles(userArguments.fileGlobs);

let outputStream = new TestOutputStream();

if (userArguments.tap) {
   // if they want TAP output then just write to stdout directly
   outputStream.pipe(process.stdout);
}
else {
   // otherwise create the tap bark reporter
   const bark = TapBark.create();

   // pipe the reporter into stdout
   outputStream.pipe(bark.getPipeable()).pipe(process.stdout);
}

// create alsatian test runner
let testRunner = new TestRunner(outputStream);

// run the test set
let cliTestRunner = new CliTestRunner(testRunner);
cliTestRunner.run(testSet, userArguments.timeout);
