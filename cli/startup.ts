import { createTestSet, TestRunner, TestOutput } from "../core/alsatian-core";
import { CliTestRunner } from "./cli-test-runner";
import { AlsatianCliOptions } from "./alsatian-cli-options";

// get all arguments from the user
const userArguments = new AlsatianCliOptions(process.argv.slice(2));

// create test set from given file globs
const testSet = createTestSet();
testSet.addTestsFromFiles(userArguments.fileGlobs);

const output = new TestOutput(process.stdout);

// create alsatian test runner
var testRunner = new TestRunner(output);

// run the test set
var cliTestRunner = new CliTestRunner(testRunner);
cliTestRunner.run(testSet, userArguments.timeout);
