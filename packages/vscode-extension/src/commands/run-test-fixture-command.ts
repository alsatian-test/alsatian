import { AlsatianCommand } from "./alsatian-command";
import { TextEditorDecorationType, window, Uri, Range, ExtensionContext } from "vscode";
import { fork } from "child_process";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { TestOutcome } from "alsatian";
import { Icons } from "../icons";
import { RunTestCommand } from "./run-test-command";

const styles: { [key: string]: TextEditorDecorationType } = {

};

export class RunTestFixtureCommand extends AlsatianCommand {
    protected static commandName = "runFixtureTest";
    public static title = "$(play) Run All";
    private static testRunningIconPath: Uri;

    public static setup(context: ExtensionContext) {
        super.setup(context);

        RunTestFixtureCommand.testRunningIconPath = Icons.getTestRunningIconPath(context);
    }
    
    public static async execute(fileName: string, fixture: any) {
        const range = fixture.range;
        
        // need to make more robust (perhaps pass in document instead)
        const editor = window.visibleTextEditors.filter(x => x.document.fileName === fileName)[0];
    
        const runningDecorator = window.createTextEditorDecorationType({
            gutterIconPath: RunTestFixtureCommand.testRunningIconPath,
            gutterIconSize: "contain"
        });
    
        //TODO: may need to push this to the background in order for the change to apply I guess the thread is locked
        //      preventing update / may want to use vscode's EventEmitter
        editor.setDecorations(runningDecorator, [{range: new Range(range.start, range.start)}]);
    
        //TODO: this is likely inefficient and can be refactored to avoid loading the document multiple times
        await Promise.all(
            fixture.tests.map((test: any) => RunTestCommand.execute(fileName, fixture.className, test.name, test.selectionRange))
        );
    
        runningDecorator.dispose();
    }
}