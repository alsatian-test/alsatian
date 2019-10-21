import * as Alsatian from "../../../core/alsatian-core";

// create test set
const testSet = Alsatian.TestSet.create();
testSet.addTestsFromFiles("./dist/test/integration-tests/test-sets/**/*.spec.js");

// run the test set
const testRunner = new Alsatian.TestRunner();
testRunner.run(testSet);
