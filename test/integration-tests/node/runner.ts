import * as Alsatian from "../../../core/alsatian-core";

// create test set
let testSet = Alsatian.TestSet.create();
testSet.addTestsFromFiles("./test/integration-tests/test-sets/expectations/**/*.expect.js");

// run the test set
let testRunner = new Alsatian.TestRunner();
testRunner.run(testSet);
