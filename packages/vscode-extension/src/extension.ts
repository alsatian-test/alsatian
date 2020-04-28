import { ExtensionContext } from "vscode";
import { AlsatianCodeLensProvider } from "./alsatian-code-lens-provider";
import { RunTestCommand } from "./commands/run-test-command";
import { DebugTestCommand } from "./commands/debug-test-command";
import { RunTestFixtureCommand } from "./commands/run-test-fixture-command";
import { OpenSpecCommand } from "./commands/open-spec";
import { AlsatianTestTreeViewDataProvider } from "./tree-view/alsatian-test-tree-view-data-provider";
import { TreeviewRunTestCommand } from "./commands/treeview-run-test-command";
import { TestRunner } from "./running/test-runner";

export function activate(context: ExtensionContext) {
	const testRunner = new TestRunner();

	RunTestCommand.setup(context, testRunner);
	DebugTestCommand.setup(context);
	RunTestFixtureCommand.setup(context);

	AlsatianCodeLensProvider.setup(context);

	TreeviewRunTestCommand.setup(context, testRunner);
	OpenSpecCommand.setup(context);
	AlsatianTestTreeViewDataProvider.setup(testRunner);
	
}

export function deactivate() {}
