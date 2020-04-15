import { AlsatianCommand } from "./alsatian-command";
import { TextEditorDecorationType, window, Uri, Range, ExtensionContext } from "vscode";
import { fork } from "child_process";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { TestOutcome } from "alsatian";
import { Icons } from "../icons";
import { join } from "path";
import { showIcon } from "./show-icon";

const styles: { [key: string]: TextEditorDecorationType } = {

};

const output = window.createOutputChannel("Alsatian");

export class RunTestCommand extends AlsatianCommand {
    protected static commandName = "runTest";
    public static title = "$(play) Run";
    private static testRunningIconPath: Uri;
    private static testSuccessIconPath: Uri;
    private static testFailureIconPath: Uri;

    public static setup(context: ExtensionContext) {
        super.setup(context);

        RunTestCommand.testRunningIconPath = Icons.getTestRunningIconPath(context);
        RunTestCommand.testSuccessIconPath = Icons.getTestSuccessIconPath(context);
        RunTestCommand.testFailureIconPath = Icons.getTestFailureIconPath(context);
    }
    
    public static async execute(fileName: string, fixtureName: string, testName: string, range: Range, execArgv?: string[]) {
        if (styles[testName]) {
            styles[testName].dispose();
        }

        // need to make more robust (perhaps pass in document instead)
        const editor = window.visibleTextEditors.filter(x => x.document.fileName === fileName)[0];

        const runningDecorator = showIcon(editor, RunTestCommand.testRunningIconPath, [ range ]);

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

        const pass = results && results.every(x => x.outcome === TestOutcome.Pass);
        const errors = results?.filter(result => result.error).map(result => result.error) || [];

        const resultDecoration = showIcon(
            editor,
            pass ? RunTestCommand.testSuccessIconPath : RunTestCommand.testFailureIconPath,
            [
                {
                    range,
                    renderOptions: {
                        after: {
                            margin: "2em",
                            contentText: errors[0] || results === null ? errors[0]?.message || "An unknown error ocurred" : "",
                            color: "#f44"
                        }
                    },	
                }
            ]
        );

        styles[testName] = resultDecoration;

        runningDecorator.dispose();

        console.log(`run ${testName} resulted in ${pass ? "success" : "failure"}`);
    }
}
