import { TapBark } from "tap-bark";
import { TestSet, TestRunner } from "alsatian";

async function runTypeScriptTests() {
	try {
		const testSet = TestSet.create();
		testSet.addTestsFromFiles(
			"./test/integration-tests/test-sets/**/*.spec.ts"
		);

		const testRunner = new TestRunner();

		testRunner.outputStream
			.pipe(TapBark.create().getPipeable())
			.pipe(process.stdout);

		await testRunner.run(testSet);

		// if we got this far then everything ran fine! :)
		process.exit(0);
	} catch (error) {
		process.stderr.write(error);
		process.exit(1);
	}
}

runTypeScriptTests();
