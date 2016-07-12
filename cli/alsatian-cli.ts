#! /usr/bin/env node

import { TestRunner, TestSet } from "../core/alsatian-core";

// get all arguments from the user
let userArguments = process.argv.slice(2);

// filter out the file globs
let fileGlobs = userArguments.filter((argument: string) => argument.indexOf("-") !== 0);

// filter out the options
let options = userArguments.filter((argument: string) => argument.indexOf("-") === 0);

// create test set from given file globs
let testSet = new TestSet(fileGlobs);

// create runner and run those tests
let testRunner = new TestRunner();

testRunner.run(testSet).then((results: Array<any>) => {
  console.log(results);
  process.exit(0);
});
