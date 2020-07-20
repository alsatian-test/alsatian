import { AlsatianCommand } from "../commands/alsatian-command";
import { ExtensionContext, workspace } from "vscode";
import { AlsatianTestTreeViewItem } from "../tree-view/alsatian-test-tree-view-item";
import { TestRunner } from "../running/test-runner";
import { AlsatianTestFixtureTreeViewItem } from "../tree-view/alsatian-test-fixture-tree-view-item";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { TestOutcome } from "alsatian";
import { TestSetTreeViewItem } from "../tree-view/test-set-tree-view-item";
import { AlsatianTestTreeViewDataProvider } from "./alsatian-test-tree-view-data-provider";

export class UpdateTreeviewCommand extends AlsatianCommand {
    protected static commandName = "refreshTreeView";
    public static title = "Refresh Tree View";
    private static treeViewDataProvider: AlsatianTestTreeViewDataProvider;

    public static setup(context: ExtensionContext, treeViewDataProvider: AlsatianTestTreeViewDataProvider) {
        super.setup(context);

        UpdateTreeviewCommand.treeViewDataProvider = treeViewDataProvider;
    }

    public static async execute() {
        UpdateTreeviewCommand.treeViewDataProvider.refresh();
    }
}
