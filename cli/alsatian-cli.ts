#! /usr/bin/env node

import { createTestSet, TestRunner, TestOutput } from "../core/alsatian-core";
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

let reporter: any;
const stream = new Writable();
stream._write = (a, b, callback) => { console.log("stream:", a.toString()), callback() };

if (userArguments.tap) {
  // if they want TAP output then just write to stdout directly
  reporter = stream;
} else {
  // otherwise create the tap bark reporter
  var bark = TapBark.create();

  var barkStream = new Readable();
  barkStream._read = (data) => { } ;
  //barkStream.pipe(stream);

  // pipe the reporter into stdout
  barkStream.pipe(bark.getPipeable()).pipe(process.stdout);
}

let output = new TestOutput(barkStream);

// create alsatian test runner
let testRunner = new TestRunner(output);

// run the test set
let cliTestRunner = new CliTestRunner(testRunner);
cliTestRunner.run(testSet, userArguments.timeout);
