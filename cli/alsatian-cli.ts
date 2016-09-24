#! /usr/bin/env node

import { createTestSet, TestRunner, TestOutput } from "../core/alsatian-core";
import { CliTestRunner } from "./cli-test-runner";
import { AlsatianCliOptions } from "./alsatian-cli-options";

const {
  TapBark
} = require("tap-bark");

// get all arguments from the user
let userArguments = new AlsatianCliOptions(process.argv.slice(2));

// create test set from given file globs
let testSet = createTestSet();
testSet.addTestsFromFiles(userArguments.fileGlobs);

let reporter: any;

if (userArguments.tap) {
  // if they want TAP output then just write to stdout directly
  reporter = process.stdout;
} else {
  // otherwise create the tap bark reporter
  reporter = TapBark.create().getPipeable();

  // pipe the reporter into stdout
  reporter.pipe(process.stdout);
}

let output = new TestOutput(reporter);

// create alsatian test runner
let testRunner = new TestRunner(output);

// run the test set
let cliTestRunner = new CliTestRunner(testRunner);
cliTestRunner.run(testSet, userArguments.timeout);

//console.log (TapBark.create.toString());
