import { EventEmitter, window } from "vscode";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { fork } from "child_process";
import { join } from "path";

const output = window.createOutputChannel("Alsatian");

export class TestRunner {
    private resultEmitter = new EventEmitter<TestResultEvent>();

    public subscribe = this.resultEmitter.event;

    public async runTest(fileName: string, fixtureName: string, testName?: string, execArgv?: string[]) {

        const eventData = {
            fileName,
            fixtureName,
            testName
        };

        this.resultEmitter.fire({
            type: ResultEventType.Started,
            payload: {
                ...eventData
            }
        });

        const runArguments = [ fileName, fixtureName ];

        if (testName) {
            runArguments.push(testName);
        }

        const runProcess = fork(join(__dirname, `../run`), runArguments, { execArgv });

        const results = await new Promise<ITestCompleteEvent[] | null>((resolve, reject) => {
            let results = [] as ITestCompleteEvent[];

            runProcess.on("message", message => {
                if (message.type === "testComplete") {
                    this.resultEmitter.fire({
                        type: ResultEventType.TestCompleted,
                        payload: {
                            ...eventData,
                            testName: message.test.key,
                            results: message.results
                        }
                    });

                    results = results.concat(message.results);
                }
                else if (message.type === "runComplete") {
                    resolve(results);
                }
                else {
                    output.appendLine(message);
                }
            });

            runProcess.on("exit", code => {
                if (code !== null && code > 0) {
                    this.resultEmitter.fire({
                        type: ResultEventType.Error,
                        payload: {
                            ...eventData
                        }
                    });
                }
                resolve(null);
            });
        });

        this.resultEmitter.fire({
            type: ResultEventType.RunCompleted,
            payload: {
                ...eventData,
                results
            }
        });

        return results;
    }
}

export interface TestResultEvent {
    type: ResultEventType;
    payload: {
        fileName: string,
        fixtureName: string,
        testName?: string,
        results?: Array<ITestCompleteEvent> | null
    };
}

export enum ResultEventType {
    Started = "STARTED",
    TestCompleted = "TEST_COMPLETED",
    RunCompleted = "RUN_COMPLETED",
    Error = "ERROR"
}
