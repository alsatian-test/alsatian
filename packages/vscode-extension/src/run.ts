import { TestSet, TestRunner } from "alsatian";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import * as findNearestFile from "find-nearest-file";

function sendMessage(message: any) {
    if (process.send) {
        process.send(message);
    }
}

(async () => {
    try {
        const timeout = () => {
            console.log("test run exceeded timeout");
            process.exit(1);
        };

        setTimeout(timeout, 20000);

        const fileName = process.argv[2];
        const fixtureName = process.argv[3];
        const testName = process.argv[4];

        if (require.cache[require.resolve(fileName)]) {
            delete require.cache[require.resolve(fileName)];
        }

        process.env.TS_NODE_PROJECT = (findNearestFile as any)("tsconfig.json", fileName);
        process.env.TS_NODE_TRANSPILE_ONLY = "true";
        await import("ts-node/register");

        const testSet = TestSet.create();
        sendMessage("preload");
        testSet.addTestsFromFiles(fileName);
        sendMessage("postload");

        const fixture = testSet.testFixtures.filter(x => x.fixture.constructor.name === fixtureName)[0];    
        fixture.focussed = true;
        fixture.tests.filter(x => x.key === testName).forEach(x => x.focussed = true);

        const runner = new TestRunner();
        const results: ITestCompleteEvent[] = [];
        runner.onTestComplete(x => results.push(x));
        await runner.run(testSet);

        sendMessage({
            type: "testComplete",
            results
        });
    }
    catch (error) {
        sendMessage({
            type: "testComplete",
            results: [
                { error }
            ]
        });
    }

})();
