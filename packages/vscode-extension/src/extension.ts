import { ExtensionContext, languages } from "vscode";
import { AlsatianCodeLensProvider } from "./alsatian-codelens-provider";
import { RunTestCommand } from "./commands/run-test-command";
import { DebugTestCommand } from "./commands/debug-test-command";
import { RunTestFixtureCommand } from "./commands/run-test-fixture-command";

export function activate(context: ExtensionContext) {

	RunTestCommand.setup(context);
	DebugTestCommand.setup(context);
	RunTestFixtureCommand.setup(context);

	const codeLensProviderDisposable = languages.registerCodeLensProvider(
		{
			language: "typescript",
			scheme: "file",
		},
		new AlsatianCodeLensProvider()
	);
	  
	context.subscriptions.push(codeLensProviderDisposable);
}

export function deactivate() {}
