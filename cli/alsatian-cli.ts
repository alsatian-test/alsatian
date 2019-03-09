#! /usr/bin/env node
// tslint:disable-next-line
require('ts-node/register');

import { AlsatianCliOptions } from "./alsatian-cli-options";
import { CliTestRunner } from "./cli-test-runner";

// get all arguments from the user
const userArguments = new AlsatianCliOptions(process.argv.slice(2));

// run the test set
const cliTestRunner = CliTestRunner.create();
cliTestRunner.run(userArguments);
