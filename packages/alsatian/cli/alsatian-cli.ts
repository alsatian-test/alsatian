#! /usr/bin/env node

import { AlsatianCliOptions } from "./alsatian-cli-options";
import { CliTestRunner } from "./cli-test-runner";

// get all arguments from the user
const userArguments = new AlsatianCliOptions(process.argv.slice(2));

// import ts-node/register after retrieving arguments in case --project specified
import "ts-node/register/transpile-only";

// run the test set
const cliTestRunner = CliTestRunner.create();
cliTestRunner.run(userArguments);
