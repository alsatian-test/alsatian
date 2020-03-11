import { AlsatianCommand } from "./alsatian-command";
import { TextEditorDecorationType, window, Uri, Range, ExtensionContext, debug } from "vscode";
import { fork } from "child_process";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { TestOutcome } from "alsatian";
import { Icons } from "../icons";
import { RunTestCommand } from "./run-test-command";

const styles: { [key: string]: TextEditorDecorationType } = {

};

export class DebugTestCommand extends AlsatianCommand {
    protected static commandName = "debugTest";
    public static title = "$(debug) Debug";
    
    public static async execute(fileName: string, fixtureName: string, testName: string, range: Range) {
        const debuggerPort = 40894;
        
        debug.startDebugging(
            undefined,
            {
                name: "alsatian debugging",
                type: 'node',
                request: 'attach',
                port: debuggerPort,
                protocol: 'inspector',
                timeout: 5000,
                stopOnEntry: false
            }
        );

        RunTestCommand.execute(fileName, fixtureName, testName, range, ['--inspect-brk=' + (debuggerPort)]);
    }
}