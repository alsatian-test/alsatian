import { TestSet, TestRunner } from "alsatian";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { IMessage, MessageType } from "./message";

function sendMessage<T extends IMessage | string>(message: T) {
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

        const testSet = await TestSet.create(fileName);

        testSet.addTestsFromFiles(fileName);

        const fixture = testSet.testFixtures.filter(x => x.fixture.constructor.name === fixtureName)[0];    
        fixture.focussed = true;

        if (testName) {
            fixture.tests.filter(x => x.key === testName).forEach(x => x.focussed = true);
        }

        const runner = new TestRunner();
        const results: ITestCompleteEvent[] = [];
        runner.onTestComplete(x => {
            results.push(x);
            sendMessage({
                type: MessageType.TestComplete,
                test: x.test,
                results: [ { outcome: x.outcome, error: x.error ? { message: x.error?.message }: null } ]
            });
        });
        await runner.run(testSet);

        sendMessage(`tests complete for ${fileName} ${fixtureName} ${testName}`);

        sendMessage({
            type: MessageType.RunComplete,
            results: results.map(x => ({ outcome: x.outcome, error: x.error ? { message: x.error?.message }: null }))
        });
    }
    catch (error) {        
        sendMessage(`error running test ${error}`);
        sendMessage({
            type: MessageType.RunComplete,
            results: [
                { error: { message: error.message }, stack: error.stack }
            ]
        });
    }

})();
