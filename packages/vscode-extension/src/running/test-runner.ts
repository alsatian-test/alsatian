import { EventEmitter, window } from "vscode";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { fork } from "child_process";
import { join } from "path";

const output = window.createOutputChannel("Alsatian");

export class TestRunner {
    private resultEmitter = new EventEmitter<TestResultEvent>();

    public subscribe = this.resultEmitter.event;

    public async runTest(fileName: string, fixtureName: string, testName: string, execArgv?: string[]) {

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

        const runProcess = fork(join(__dirname, `../run`), [ fileName, fixtureName, testName ], { execArgv });
    
        const results = await new Promise<ITestCompleteEvent[] | null>((resolve, reject) => {
            runProcess.on("message", message => {
                if (message.type === "testComplete") {
                    resolve(message.results);
                }
                else {
                    output.appendLine(message);
                }
            });
    
            runProcess.on("exit", code => {
                resolve(null);
            });
        });

        this.resultEmitter.fire({
            type: ResultEventType.Completed,
            payload: {
                ...eventData,
                results
            }
        });
    }
}

export interface TestResultEvent {
    type: ResultEventType;
    payload: {
        fileName: string,
        fixtureName: string,
        testName: string,
        results?: Array<ITestCompleteEvent> | null
    };
}

export enum ResultEventType {
    Started = "STARTED",
    Completed = "COMPLETED"
}
