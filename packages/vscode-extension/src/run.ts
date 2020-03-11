import { TestSet, TestRunner, TestOutcome } from "alsatian";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import * as findNearestFile from "find-nearest-file";

function sendMessage(message: any) {
    if (process.send) {
        process.send(message);
    }
}

(async () => {
    const timeout = () => {
        console.log("test run exceeded timeout");
        process.exit(1);
    };

    setTimeout(timeout, 20000);

    const fileName = process.argv[2];
    const testName = process.argv[3];

    sendMessage({
        fileName,
        testName
    });

	//TODO: may need to do more than this should test against running for multiple files
	if (require.cache[require.resolve(fileName)]) {
		delete require.cache[require.resolve(fileName)];
	}

	//TODO: test what happens across multiple projects in same workspace
    process.env.TS_NODE_PROJECT = (findNearestFile as any)("tsconfig.json", fileName);
    process.env.TS_NODE_TRANSPILE_ONLY = "true";
	await import("ts-node/register");

	const testSet = TestSet.create();
	testSet.addTestsFromFiles(fileName);

	//TODO: ensure correct fixture is selected
	testSet.testFixtures[0].tests.filter(x => x.key === testName).forEach(x => x.focussed = true);

	const runner = new TestRunner();
	const results: ITestCompleteEvent[] = [];
	runner.onTestComplete(x => results.push(x));
	await runner.run(testSet);

    const pass = results.every(x => x.outcome === TestOutcome.Pass);

    sendMessage({
        type: "testComplete",
        pass
    });

})();
