import * as Alsatian from "../../../core/alsatian-core";

// create test set
let testSet = Alsatian.createTestSet();
testSet.addTestsFromFiles("./test/integration-tests/node/tests/**/*.spec.js");

// run the test set
let testRunner = new Alsatian.TestRunner();
testRunner.run(testSet);
