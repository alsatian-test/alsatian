import { AlsatianCommand } from "./alsatian-command";
import { TextEditorDecorationType, window, Uri, Range, ExtensionContext, EventEmitter } from "vscode";
import { TestOutcome } from "alsatian";
import { Icons } from "../icons";
import { showIcon } from "./show-icon";
import { TestRunner, ResultEventType } from "../running/test-runner";

const styles: { [key: string]: TextEditorDecorationType } = {

};

export class RunTestCommand extends AlsatianCommand {
    protected static commandName = "runTest";
    public static title = "$(play) Run";
    private static testRunningIconPath: Uri;
    private static testSuccessIconPath: Uri;
    private static testFailureIconPath: Uri;
    private static testRunner: TestRunner;

    public static setup(context: ExtensionContext, testRunner: TestRunner) {
        super.setup(context);

        RunTestCommand.testRunningIconPath = Icons.getTestRunningIconPath(context);
        RunTestCommand.testSuccessIconPath = Icons.getTestSuccessIconPath(context);
        RunTestCommand.testFailureIconPath = Icons.getTestFailureIconPath(context);
        RunTestCommand.testRunner = testRunner;
    }
    
    public static async execute(fileName: string, fixtureName: string, testName: string, range: Range, execArgv?: string[]) {
        if (styles[testName]) {
            styles[testName].dispose();
        }

        const subscription = RunTestCommand.testRunner.subscribe(event => {
            
            if (
                event.payload.fileName !== fileName
            || event.payload.fixtureName !== fixtureName
            || event.payload.testName !== testName
            ) {
                return;
            }            

            if (event.type === ResultEventType.RunCompleted) {
                subscription.dispose();
            }

            // need to make more robust (perhaps pass in document instead)
            const editor = window.visibleTextEditors.filter(x => x.document.fileName === fileName)[0];

            if (event.type === ResultEventType.Started) {
                styles[testName]?.dispose();              
    
                styles[testName] = showIcon(editor, RunTestCommand.testRunningIconPath, [ range ]);
                
            }
            else if (event.type === ResultEventType.TestCompleted) {
                styles[testName]?.dispose();

                const results = event.payload.results;

                const pass = results && results.every(x => x.outcome === TestOutcome.Pass);
                const errors = results?.filter(result => result.error).map(result => result.error) || [];
    
                styles[testName] = showIcon(
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
        
                console.log(`run ${testName} resulted in ${pass ? "success" : "failure"}`);
            }
        });

        await RunTestCommand.testRunner.runTest(fileName, fixtureName, testName, execArgv);
    }
}
