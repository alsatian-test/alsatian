// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, debug, ExtensionContext, languages, window, TextEditor, TextEditorDecorationType, Range, Uri, DecorationOptions, Position, TextDocument } from "vscode";
import { AlsatianCodeLensProvider } from "./alsatian-codelens-provider";
import { TestRunner, TestSet, TestOutcome } from "alsatian";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import * as findNearestFile from "find-nearest-file";

let successPath: string;
let failurePath: string;
let runningPath: string;
const styles: { [key: string]: TextEditorDecorationType } = {

};

async function runTest(fileName: string, testName: string, range: Range) {
	if (styles[testName]) {
		styles[testName].dispose();
	}

	// need to make more robust (perhaps pass in document instead)
	const editor = window.visibleTextEditors.filter(x => x.document.fileName === fileName)[0];

	const runningDecorator = window.createTextEditorDecorationType({
		gutterIconPath: Uri.file(runningPath),
		gutterIconSize: "contain"
	});

	//TODO: may need to push this to the background in order for the change to apply I guess the thread is locked
	//      preventing update / may want to use vscode's EventEmitter
	editor.setDecorations(runningDecorator, [{range: new Range(range.start, range.start)}]);

	//TODO: may need to do more than this should test against running for multiple files
	if (require.cache[require.resolve(fileName)]) {
		delete require.cache[require.resolve(fileName)];
	}

	//TODO: test what happens across multiple projects in same workspace
	process.env.TS_NODE_PROJECT = (findNearestFile as any)("tsconfig.json", fileName);
	await import("ts-node/register");

	const testSet = TestSet.create();
	testSet.addTestsFromFiles(fileName);

	//TODO: ensure correct fixture is selected
	testSet.testFixtures[0].tests.filter(x => x.key === testName).forEach(x => x.focussed = true);

	const runner = new TestRunner();
	const results: ITestCompleteEvent[] = [];
	runner.onTestComplete(x => results.push(x));
	await runner.run(testSet);

	const pass = results.every(x => x.outcome === TestOutcome.Pass);

	const iconPath = Uri.file(pass ? successPath : failurePath);

	const decoration = window.createTextEditorDecorationType({
		isWholeLine: true,
		gutterIconPath: iconPath,
		gutterIconSize: "contain",
		
	});

	styles[testName] = decoration;

	// new EventEmitter().fire({ type: "test", test: testName, state: pass ? "passed" : "failed" });
	runningDecorator.dispose();
	editor.setDecorations(decoration, [
		{
			range: new Range(range.start, range.start),
			hoverMessage: pass ? "Test Passed" : results.map(x => x.error?.message).join("\n")			
		}
	]);

	console.log(`run ${testName} resulted in ${pass ? "success" : "failure"}`);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	context.subscriptions.push(
		commands.registerCommand(
			"alsatian.runTest",
			runTest
		)
	);

	successPath = context.asAbsolutePath(`src/success.svg`);
	failurePath = context.asAbsolutePath(`src/failure.svg`);
	runningPath = context.asAbsolutePath(`src/running.svg`);

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
