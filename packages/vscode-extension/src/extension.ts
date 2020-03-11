import { ExtensionContext, languages } from "vscode";
import { AlsatianCodeLensProvider } from "./alsatian-codelens-provider";
import { RunTestCommand } from "./commands/run-test-command";
import { DebugTestCommand } from "./commands/debug-test-command";
import { RunTestFixtureCommand } from "./commands/run-test-fixture-command";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
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

// this method is called when your extension is deactivated
export function deactivate() {}
