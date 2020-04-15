import { TestSet, TestRunner } from "alsatian";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { join } from "path";
import { findNearestFile } from "./find-nearest-file";

function sendMessage(message: any) {
    if (process.send) {
        process.send(message);
    }
}

(async () => {
    try {
        const fileName = process.argv[2];
        const fixtureName = process.argv[3];
        const testName = process.argv[4];
        sendMessage(`start running for ${fileName} ${fixtureName} ${testName}`);

        if (require.cache[require.resolve(fileName)]) {
            delete require.cache[require.resolve(fileName)];
        }

        const alsatianConfigPath = await findNearestFile(".alsatianrc.json", fileName);

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

        testSet.addTestsFromFiles(fileName);

        const fixture = testSet.testFixtures.filter(x => x.fixture.constructor.name === fixtureName)[0];    
        fixture.focussed = true;
        fixture.tests.filter(x => x.key === testName).forEach(x => x.focussed = true);

        const runner = new TestRunner();
        const results: ITestCompleteEvent[] = [];
        runner.onTestComplete(x => results.push(x));
        await runner.run(testSet);

        sendMessage(`tests complete for ${fileName} ${fixtureName} ${testName}`);

        sendMessage({
            type: "testComplete",
            results: results.map(x => ({ outcome: x.outcome, error: x.error ? { message: x.error?.message }: null }))
        });
    }
    catch (error) {        
        sendMessage(`error running test ${error}`);
        sendMessage({
            type: "testComplete",
            results: [
                { error: { message: error.message }, stack: error.stack }
            ]
        });
    }

})();

async function registerTsNode(tsconfigPath: string | null) {
    //TODO: add error if no tsconfig resolved - this is not likely to be correct setup
    process.env.TS_NODE_PROJECT = tsconfigPath || "";

    await import("tsconfig-paths/register");

    process.env.TS_NODE_TRANSPILE_ONLY = "true";
    await import("ts-node/register");
}
