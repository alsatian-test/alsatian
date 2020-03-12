import { AlsatianCommand } from "./alsatian-command";
import { TextEditorDecorationType, window, Uri, ExtensionContext } from "vscode";
import { Icons } from "../icons";
import { RunTestCommand } from "./run-test-command";
import { showIcon } from "./show-icon";

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
        
        const runningDecorator = showIcon(editor, RunTestFixtureCommand.testRunningIconPath, [ range ]);
    
        //TODO: this is likely inefficient and can be refactored to avoid loading the document multiple times
        await Promise.all(
            fixture.tests.map((test: any) => RunTestCommand.execute(fileName, fixture.className, test.name, test.selectionRange))
        );
    
        runningDecorator.dispose();
    }
}