#! /usr/bin/env node

import * as Glob from "glob";
import { TestRunner } from "../core/alsatian-core";

const path = require("path");

// get all arguments from the user
let userArguments = process.argv.slice(2);

let callerLocation = process.cwd();

// filter out the file globs
let fileGlobs = userArguments.filter((argument: string) => argument.indexOf("-") !== 0);

// filter out the options
let options = userArguments.filter((argument: string) => argument.indexOf("-") === 0);

let testRunner = new TestRunner();

// for each glob passed
fileGlobs.forEach((fileGlob: string) => {

   // if it's not a glob the parse the file
   if (fileGlob.indexOf("*") === -1) {
      testRunner.loadTest(path.resolve(callerLocation, fileGlob));
   }
   // otherwise parse all the files in the glob
   else {
      Glob(fileGlob, (error: Error, files: Array<string>) => {
         testRunner.loadTests(files);
      });
   }
});

testRunner.run();
