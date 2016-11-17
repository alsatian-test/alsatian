import * as Gulp from "gulp";
import { TestSet, TestRunner } from "../../../core/alsatian-core";
import { TapBark } from "tap-bark";

Gulp.task("test-expectations", (done: () => any) => {

    // create test set
    const testSet = TestSet.create();
    testSet.addTestsFromFiles("./test/integration-tests/test-sets/expectations/**/*.spec.js");

    const testRunner = new TestRunner();

    testRunner.outputStream
              .pipe(TapBark.create().getPipeable()) // pipe to your favourite tap producer or not and just get TAP :) 
              .pipe(process.stdout);

    // run the test set
    testRunner.run(testSet)
              .then(() => done());
});