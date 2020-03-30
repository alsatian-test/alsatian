import { TestSet, TestRunner } from "alsatian";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { join } from "path";
import { findNearestFile } from "./find-nearest-file";

//TODO: migrate this to output window or something (with log levels)
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

        sendMessage("trying to find alsatian config")

        const alsatianConfigPath = await findNearestFile(".alsatianrc.json", fileName);

        sendMessage(`alsatian config resolved as ${alsatianConfigPath}`);

        if (alsatianConfigPath) {
            const alsatianConfig = await import(alsatianConfigPath);
            
            const root = alsatianConfigPath.split(/[\\/]/);
            root.pop();
            const rootPath = root.join("/");

            await registerTsNode(
                alsatianConfig.tsconfig ?
                join(rootPath, alsatianConfig.tsconfig) :
                await findNearestFile("tsconfig.json", fileName)
            );
    
            const preTestScripts = ((alsatianConfig.preTestScripts || []) as string[]).map(script => join(rootPath, script));
    
            await Promise.all(preTestScripts.map(script => import(script)));
        }
        else {
            await registerTsNode(await findNearestFile("tsconfig.json", fileName));
        }

        const testSet = TestSet.create();
        sendMessage(`adding tests for: ${fileName}`);

        testSet.addTestsFromFiles(fileName);

        sendMessage(`tests added`);

        const fixture = testSet.testFixtures.filter(x => x.fixture.constructor.name === fixtureName)[0];    
        fixture.focussed = true;
        fixture.tests.filter(x => x.key === testName).forEach(x => x.focussed = true);

        sendMessage(`tests: ${fixture.tests.length}`);

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
                { error: { message: JSON.stringify(error) }, stack: error.stack }
            ]
        });
    }

})();

async function registerTsNode(tsconfigPath: string | null) {
    //TODO: add error if no tsconfig resolved - this is not likely to be correct setup
    process.env.TS_NODE_PROJECT = tsconfigPath || "";
    sendMessage(`tsconfig.json is ${process.env.TS_NODE_PROJECT}`);

    await import("tsconfig-paths/register");

    process.env.TS_NODE_TRANSPILE_ONLY = "true";
    await import("ts-node/register");
}
