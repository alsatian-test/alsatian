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

        const alsatianConfigPath: string = (findNearestFile as any)(".alsatianrc.json", fileName);

        if (alsatianConfigPath) {
            const alsatianConfig = await import(alsatianConfigPath);
            
            const root = alsatianConfigPath.split(/[\\/]/);
            root.pop();
            const rootPath = root.join("/");
    
            const preTestScripts = (alsatianConfig.preTestScripts as string[]).map(script => join(rootPath, script));
    
            await Promise.all(preTestScripts.map(script => import(script)));
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

        sendMessage({
            type: "testComplete",
            results
        });
    }
    catch (error) {
        sendMessage({
            type: "testComplete",
            results: [
                { error, stack: error.stack }
            ]
        });
    }

})();
