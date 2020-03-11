import { AlsatianCommand } from "./alsatian-command";
import { TextEditorDecorationType, window, Uri, Range, ExtensionContext } from "vscode";
import { fork } from "child_process";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { TestOutcome } from "alsatian";
import { Icons } from "../icons";
import { join } from "path";

const styles: { [key: string]: TextEditorDecorationType } = {

};

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

        const runningDecorator = window.createTextEditorDecorationType({
            gutterIconPath: RunTestCommand.testRunningIconPath,
            gutterIconSize: "contain"
        });

        //TODO: may need to push this to the background in order for the change to apply I guess the thread is locked
        //      preventing update / may want to use vscode's EventEmitter
        editor.setDecorations(runningDecorator, [{range: new Range(range.start, range.start)}]);

        const runProcess = fork(join(__dirname, `../run`), [ fileName, fixtureName, testName ], { execArgv });

        const results = await new Promise<ITestCompleteEvent[] | null>((resolve, reject) => {
            runProcess.on("message", message => {
                if (message.type === "testComplete") {
                    resolve(message.results);
                }
            });

            runProcess.on("exit", code => {
                resolve(null);
            });
        });	

        const pass = results && results.every(x => x.outcome === TestOutcome.Pass);

        const iconPath = pass ? RunTestCommand.testSuccessIconPath : RunTestCommand.testFailureIconPath;

        const resultDecoration = window.createTextEditorDecorationType({
            isWholeLine: true,
            gutterIconPath: iconPath,
            gutterIconSize: "contain"	
        });

        const errors = results?.filter(result => result.error).map(result => result.error) || [];

        styles[testName] = resultDecoration;

        runningDecorator.dispose();
        editor.setDecorations(resultDecoration, [
            {
                range: new Range(range.start, range.start),
                renderOptions: {
                    after: {
                        margin: "2em",
                        contentText: errors[0] ? errors[0].message || (errors[0] as any)._message || "An unknown error ocurred" : "",
                        color: "#f44"
                    }
                },	
            }
        ]);

        console.log(`run ${testName} resulted in ${pass ? "success" : "failure"}`);
    }
}