#! /usr/bin/env node

import { createTestSet, TestRunner } from "../core/alsatian-core";
import { CliTestRunner } from "./cli-test-runner";

// get all arguments from the user
let userArguments = process.argv.slice(2);

// filter out the file globs
let fileGlobs = userArguments.filter((argument: string) => argument.indexOf("-") !== 0);

// filter out the options
let options = userArguments.filter((argument: string) => argument.indexOf("-") === 0);

// create test set from given file globs
let testSet = createTestSet();

testSet.addTestsFromFiles(fileGlobs);

let testRunner = new CliTestRunner();
testRunner.run(testSet);
