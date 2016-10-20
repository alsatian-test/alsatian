#! /usr/bin/env node

import { CliTestRunner } from "./cli-test-runner";
import { AlsatianCliOptions } from "./alsatian-cli-options";

// get all arguments from the user
const userArguments = new AlsatianCliOptions(process.argv.slice(2));

// run the test set
let cliTestRunner = CliTestRunner.create();
cliTestRunner.run(userArguments);
