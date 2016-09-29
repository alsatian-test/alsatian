#! /usr/bin/env node

import { createTestSet, TestRunner } from "../core/alsatian-core";
import { CliTestRunner } from "./cli-test-runner";
import { AlsatianCliOptions } from "./alsatian-cli-options";

// get all arguments from the user
let userArguments = new AlsatianCliOptions(process.argv.slice(2));

// create test set from given file globs
let testSet = createTestSet();
testSet.addTestsFromFiles(userArguments.fileGlobs);

// create alsatian test runner
let testRunner = new TestRunner();

// run the test set
let cliTestRunner = new CliTestRunner(testRunner);
cliTestRunner.run(testSet, userArguments.timeout);
