import { AlsatianCommand } from "./alsatian-command";
import { ExtensionContext } from "vscode";
import { AlsatianTestTreeViewItem } from "../tree-view/alsatian-test-tree-view-item";
import { TestRunner } from "../running/test-runner";

export class TreeviewRunTestCommand extends AlsatianCommand {
    protected static commandName = "treeviewRunTest";
    public static title = "$(play) Run";
    private static testRunner: TestRunner;

    public static setup(context: ExtensionContext, testRunner: TestRunner) {
        super.setup(context);

        TreeviewRunTestCommand.testRunner = testRunner;
    }

    public static async execute(view: AlsatianTestTreeViewItem) {
        await TreeviewRunTestCommand.testRunner.runTest(view.fixture.filePath, view.fixture.fixture.constructor.name, view.test.key);
    }
}
