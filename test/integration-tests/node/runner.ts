import * as Alsatian from "alsatian";

// create test set
let testSet = Alsatian.createTestSet();
testSet.addTestsFromFiles("./tests/**/*.spec.ts");

// run the test set
let testRunner = new Alsatian.TestRunner();
testRunner.run(testSet);
