#! /usr/bin/env node

import { TestRunner, TestSet } from "../core/alsatian-core";

// get all arguments from the user
let userArguments = process.argv.slice(2);

// filter out the file globs
let fileGlobs = userArguments.filter((argument: string) => argument.indexOf("-") !== 0);

// filter out the options
let options = userArguments.filter((argument: string) => argument.indexOf("-") === 0);

let testSet = new TestSet(fileGlobs);

console.log(testSet);

let testRunner = new TestRunner();

testRunner.run(testSet);
