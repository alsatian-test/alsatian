#! /usr/bin/env node

import "ts-node/register";
import {WebstormTestRunnerFactory} from "./WebstormTestRunnerFactory";
import {WebstormPluginRestClient} from "./WebstormPluginRestClient";
import {ExecutionPlanUtil} from "./ExecutionPlanUtil";
import {ConsoleOutputManager} from "./ConsoleOutputManager";
import { TestSet } from "alsatian";

const host = process.argv[2];
const port = parseInt(process.argv[3]);
const mode = process.argv[4];
const webstormPluginRestClient = new WebstormPluginRestClient(host, port);
const executionPlanUtil = new ExecutionPlanUtil();
let exitCode = 0;

(async () => {
    const testSet = TestSet.create();

    if (mode === 'LISTOFGLOBS') {
        testSet.addTestsFromFiles(process.argv.slice(5));
    } else {
        let executionPlanFile: string = process.argv[5];
        executionPlanUtil.filterFocusedTestsBasedOnExecutionPlan(executionPlanFile, testSet);
    }

    let consoleReader = null;
    try {
        consoleReader = ConsoleOutputManager.instance.createConsoleReaderAndRedirectSystemOut();
        let webstormTestRunnerFactory = new WebstormTestRunnerFactory(webstormPluginRestClient);
        let testRunner = webstormTestRunnerFactory.createTestRunner(consoleReader);
        await testRunner.run(testSet, 0);
    } finally {
        if (consoleReader != null)
            consoleReader.close();
    }
})().catch(e => {
    ConsoleOutputManager.instance.restoreConsoleOutput();
    console.log(e);
    exitCode = 1;
}).finally(() => {
        webstormPluginRestClient.sendTestingFinished().then(() => {
                process.exit(exitCode);
            }
        );
    }
);

