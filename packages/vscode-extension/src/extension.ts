import { ExtensionContext } from "vscode";
import { AlsatianCodeLensProvider } from "./alsatian-code-lens-provider";
import { RunTestCommand } from "./commands/run-test-command";
import { DebugTestCommand } from "./commands/debug-test-command";
import { RunTestFixtureCommand } from "./commands/run-test-fixture-command";

export function activate(context: ExtensionContext) {
	RunTestCommand.setup(context);
	DebugTestCommand.setup(context);
	RunTestFixtureCommand.setup(context);
	AlsatianCodeLensProvider.setup(context);
}

export function deactivate() {}
