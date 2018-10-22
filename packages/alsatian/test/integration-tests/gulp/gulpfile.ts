import * as Gulp from "gulp";
import { TapBark } from "tap-bark";
import { TestRunner, TestSet } from "../../../core/alsatian-core";

Gulp.task("test-to-be-expectations", (done: () => any) => {
  // create test set
  const testSet = TestSet.create();
  testSet.addTestsFromFiles(
    "./dist/test/integration-tests/test-sets/expectations/to-be.spec.js"
  );

  const testRunner = new TestRunner();

  testRunner.outputStream
    // pipe to your favourite tap producer or not and just get TAP :)
    // .pipe(TapBark.create().getPipeable())
    .pipe(process.stdout);

  // run the test set
  testRunner.run(testSet).then(() => done());
});

Gulp.task("test-to-throw-expectations", (done: () => any) => {
  // create test set
  const testSet = TestSet.create();
  testSet.addTestsFromFiles(
    "./dist/test/integration-tests/test-sets/expectations/to-throw.spec.js"
  );

  const testRunner = new TestRunner();

  testRunner.outputStream
    // pipe to your favourite tap producer or not and just get TAP :)
    // .pipe(TapBark.create().getPipeable())
    .pipe(process.stdout);

  // run the test set
  testRunner.run(testSet).then(() => done());
});

Gulp.task("test-syntax", (done: () => any) => {
  // create test set
  const testSet = TestSet.create();
  testSet.addTestsFromFiles(
    "./dist/test/integration-tests/test-sets/test-syntax/**/*.spec.js"
  );

  const testRunner = new TestRunner();

  testRunner.outputStream
    // .pipe(TapBark.create().getPipeable())
    // pipe to your favourite tap producer or not and just get TAP :)
    .pipe(process.stdout);

  // run the test set
  testRunner.run(testSet).then(() => done());
});
