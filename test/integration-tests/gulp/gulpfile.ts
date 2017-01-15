import * as Gulp from "gulp";
import { TapBark } from "tap-bark";
import { TestRunner, TestSet } from "../../../core/alsatian-core";

Gulp.task("test-expectations", (done: () => any) => {

    // create test set
    const testSet = TestSet.create();
    testSet.addTestsFromFiles("./test/integration-tests/test-sets/expectations/**/*.spec.js");

    const testRunner = new TestRunner();

    testRunner.outputStream
              // .pipe(TapBark.create().getPipeable()) // pipe to your favourite tap producer or not and just get TAP :) 
              .pipe(process.stdout);

    // run the test set
    testRunner.run(testSet)
              .then(() => done());
});

Gulp.task("test-syntax", (done: () => any) => {

    // create test set
    const testSet = TestSet.create();
    testSet.addTestsFromFiles("./test/integration-tests/test-sets/test-syntax/**/*.spec.js");

    const testRunner = new TestRunner();

    testRunner.outputStream
              // .pipe(TapBark.create().getPipeable()) // pipe to your favourite tap producer or not and just get TAP :) 
              .pipe(process.stdout);

    // run the test set
    testRunner.run(testSet)
              .then(() => done());
});