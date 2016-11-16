import * as Gulp from "gulp";
import { TestSet, TestRunner } from "../../../core/alsatian-core";

Gulp.task("test-expectations", (done: () => any) => {

    // create test set
    const testSet = TestSet.create();
    testSet.addTestsFromFiles("./test/integration-tests/test-sets/expectations/**/*.spec.js");

    // run the test set
    const testRunner = new TestRunner();
    testRunner.run(testSet).then(() => done());
});