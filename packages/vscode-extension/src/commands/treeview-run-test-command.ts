import { AlsatianCommand } from "./alsatian-command";
import { ExtensionContext, workspace } from "vscode";
import { AlsatianTestTreeViewItem } from "../tree-view/alsatian-test-tree-view-item";
import { TestRunner } from "../running/test-runner";
import { AlsatianTestFixtureTreeViewItem } from "../tree-view/alsatian-test-fixture-tree-view-item";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { TestOutcome } from "alsatian";
import { TestSetTreeViewItem } from "../tree-view/test-set-tree-view-item";

export class TreeviewRunTestCommand extends AlsatianCommand {
    protected static commandName = "treeviewRunTest";
    public static title = "$(play) Run";
    private static testRunner: TestRunner;

    public static setup(context: ExtensionContext, testRunner: TestRunner) {
        super.setup(context);

        TreeviewRunTestCommand.testRunner = testRunner;
    }

    public static async execute(view: AlsatianTestTreeViewItem | AlsatianTestFixtureTreeViewItem | TestSetTreeViewItem) {
        if (view instanceof AlsatianTestTreeViewItem) {
            await TreeviewRunTestCommand.testRunner.runTest(view.fixture.filePath, view.fixture.fixture.constructor.name, view.test.key);
            return;
        }

        if (view instanceof AlsatianTestFixtureTreeViewItem) {
            await TreeviewRunTestCommand.testRunner.runTest(view.fixture.filePath, view.fixture.fixture.constructor.name);
            return;
        }

        for (const fixture of view.testSet.testFixtures) {
            await TreeviewRunTestCommand.testRunner.runTest(fixture.filePath, fixture.fixture.constructor.name);
        }
    }
}
