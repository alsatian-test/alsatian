import { AlsatianCommand } from "./alsatian-command";
import { window, Uri, ExtensionContext, Range, DocumentSymbol } from "vscode";
import { Icons } from "../icons";
import { RunTestCommand } from "./run-test-command";
import { showIcon } from "./show-icon";

export interface IVsCodeTestFixture {
    className: string;
    range: Range;
    tests: Array<DocumentSymbol>
}

export class RunTestFixtureCommand extends AlsatianCommand {
    protected static commandName = "runFixtureTest";
    public static title = "$(play) Run All";
    private static testRunningIconPath: Uri;

    public static setup(context: ExtensionContext) {
        super.setup(context);

        RunTestFixtureCommand.testRunningIconPath = Icons.getTestRunningIconPath(context);
    }
    
    public static async execute(fileName: string, fixture: IVsCodeTestFixture) {
        const range = fixture.range;
        
        // need to make more robust (perhaps pass in document instead)
        const editor = window.visibleTextEditors.filter(x => x.document.fileName === fileName)[0];    
        
        const runningDecorator = showIcon(editor, RunTestFixtureCommand.testRunningIconPath, [ new Range(range.start, range.start) ]);
    
        //TODO: this is likely inefficient and can be refactored to avoid loading the document multiple times
        await Promise.all(
            fixture.tests.map(test => RunTestCommand.execute(fileName, fixture.className, test.name, test.selectionRange))
        );
    
        runningDecorator.dispose();
    }
}