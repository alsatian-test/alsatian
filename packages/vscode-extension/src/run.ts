import { TestSet, TestRunner } from "alsatian";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import * as findNearestFile from "find-nearest-file";
import { join } from "path";

function sendMessage(message: any) {
    if (process.send) {
        process.send(message);
    }
}

(async () => {
    try {
        const testRunTimeout = () => {
            console.log("test run exceeded timeout");
            process.exit(1);
        };

        const timeout = setTimeout(testRunTimeout, 20000);

        const fileName = process.argv[2];
        const fixtureName = process.argv[3];
        const testName = process.argv[4];

        if (require.cache[require.resolve(fileName)]) {
            delete require.cache[require.resolve(fileName)];
        }

        const alsatianConfigPath: string = (findNearestFile as any)(".alsatianrc.json", fileName);

        if (alsatianConfigPath) {
            const alsatianConfig = await import(alsatianConfigPath);
            
            const root = alsatianConfigPath.split(/[\\/]/);
            root.pop();
            const rootPath = root.join("/");

            await registerTsNode(
                alsatianConfig.tsconfig ?
                join(rootPath, alsatianConfig.tsconfig) :
                (findNearestFile as any)("tsconfig.json", fileName)
            );
    
            const preTestScripts = (alsatianConfig.preTestScripts as string[]).map(script => join(rootPath, script));
    
            await Promise.all(preTestScripts.map(script => import(script)));
        }
        else {
            await registerTsNode((findNearestFile as any)("tsconfig.json", fileName));
        }

        const testSet = TestSet.create();

        testSet.addTestsFromFiles(fileName);

        const fixture = testSet.testFixtures.filter(x => x.fixture.constructor.name === fixtureName)[0];    
        fixture.focussed = true;
        fixture.tests.filter(x => x.key === testName).forEach(x => x.focussed = true);

        sendMessage("pre run");

        const runner = new TestRunner();
        const results: ITestCompleteEvent[] = [];
        runner.onTestComplete(x => results.push(x));
        await runner.run(testSet);

        sendMessage(`results: ${results.length} outcome ${results[0].error?.message}`);

        sendMessage({
            type: "testComplete",
            results: results.map(x => ({ outcome: x.outcome, error: x.error }))
        });

        sendMessage("post send");

        clearTimeout(timeout);
    }
    catch (error) {
        sendMessage({
            type: "testComplete",
            info: "test fawked",
            results: [
                { error, stack: error.stack }
            ]
        });
    }

})();

async function registerTsNode(tsconfigPath: string) {
    process.env.TS_NODE_PROJECT = tsconfigPath;
    process.env.TS_NODE_TRANSPILE_ONLY = "true";
    await import("ts-node/register");
}
