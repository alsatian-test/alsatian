// import { TapBark } from "tap-bark";
// import { TestSet, TestRunner } from "alsatian";

// async function runNodeTests() {
// 	try {
// 		// create test set
// 		const testSet = TestSet.create();
// 		testSet.addTestsFromFiles("./dist/test/integration-tests/test-sets/**/*.spec.js");

// 		// run the test set
// 		const testRunner = new TestRunner();

// 		// pipe output to console
// 		testRunner.outputStream
// 			.pipe(TapBark.create().getPipeable())
// 			.pipe(process.stdout);

// 		testRunner.run(testSet);
// 		// if we got this far then everything ran fine! :)
// 		process.exit(0);
// 	} catch (error) {
// 		process.stderr.write(error);
// 		process.exit(1);
// 	}
// }

// runNodeTests();
