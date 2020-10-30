import { AlsatianCommand } from "./alsatian-command";
import { Range, debug } from "vscode";
import { RunTestCommand } from "./run-test-command";

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
