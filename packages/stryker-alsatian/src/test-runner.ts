import { StrykerOptions } from '@stryker-mutator/api/core';
import { commonTokens, tokens } from '@stryker-mutator/api/plugin';
import { RunResult, RunStatus, TestRunner, TestStatus } from '@stryker-mutator/api/test_runner';
import { TestSet } from 'alsatian';
import { TestPlan } from 'alsatian/dist/core/running';
import { clearRequireCache } from './clear-require-cache';
import "ts-node/register";
import { Logger } from '@stryker-mutator/api/logging';

declare function afterSpec(): void;
declare function beforeSpec(): void;

export class AlsatianTestRunner implements TestRunner {
    public static inject = tokens(commonTokens.logger, commonTokens.sandboxFileNames, commonTokens.options);
    private id = Math.random().toString(36).substr(2);
    private specs: string[];
    private beforeEach = () => {};
    private afterEach = () => {};

    private log(message: string) {
        this.logger.trace(`${this.id}: ${message}`);
    }

    constructor(private logger: Logger, private readonly fileNames: readonly string[], private options: StrykerOptions) {
        this.log(`constructed`);// with ${JSON.stringify(fileNames)} ${JSON.stringify(options)}`);
        this.specs = fileNames.filter(x => x.endsWith(".js")); // will include source but no good way to filter for now and seems like ts files not there
    }

    public async run(options: { testHooks?: string }): Promise<RunResult> {
        this.log(`RUN CALLED with ${JSON.stringify(options)}`);
        if (options.testHooks) {
            this.evalGlobal(options.testHooks);
        }

        clearRequireCache(this.specs);

        // SUSPECT TEST HOOKS NEED TO BE RUN AT SOME POINT THOUGH THE content seems strange
        // may need formating in the "framework" file
        
        return new Promise<RunResult>(async resolve => {

            const testSet = TestSet.create();
            testSet.addTestsFromFiles(this.specs);
            const testResults = [];
            const testPlan = new TestPlan(testSet);
            for (let index = 0; index < testPlan.testItems.length; index++) {
                const testItem = testPlan.testItems[index];
                const name = `test-${index}`;
                const startTime = Date.now();
                try {
                    this.beforeEach();
                    await testItem.run(500);
                    testResults.push({
                        name,
                        status: TestStatus.Success,
                        timeSpentMs: Date.now() - startTime
                    });
                }
                catch (e) {
                    this.log("SPEC_ERROR: " + e.toString());
                    testResults.push({
                        name,
                        status: TestStatus.Failed,
                        timeSpentMs: Date.now() - startTime
                    })
                }
                finally {
                    this.afterEach();
                }
            };

            this.log(`COVERAGE: ${JSON.stringify((global as any).__coverage__)}`);

            resolve({
                //TODO: consider renaming properties to account for typescript files?
                //      maybe this is the problem with relating back?
                coverage: (global as any).__coverage__,
                errorMessages: [],
                status: RunStatus.Complete,
                tests: testResults
            });
        });
    }
    
    evalGlobal(body: string) {
      const fn = new Function("register", body).bind(global);
      return fn(this.register.bind(this));
    }

    register(type: string, callback: any) {
        this.log("REGISTERED: " + type + " " + typeof callback);

        if (type === "beforeEach") {
            this.beforeEach = callback;
        }
        
        if (type === "afterEach") {
            this.afterEach = callback;
        }
    }
}
