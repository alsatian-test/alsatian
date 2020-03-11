// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, debug, ExtensionContext, languages, window, TextEditor, TextEditorDecorationType, Range, Uri, DecorationOptions, Position, TextDocument } from "vscode";
import { AlsatianCodeLensProvider } from "./alsatian-codelens-provider";
import { fork } from "child_process";
import { resolve } from "dns";
import { rejects } from "assert";

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

	const runProcess = fork(`${__dirname}/run`, [ fileName, testName ]);

	const pass = await new Promise((resolve, reject) => {
		runProcess.on("message", message => {
			if (message.type === "testComplete") {
				resolve(message.pass);
			}
		});

		runProcess.on("exit", code => {
			resolve(code === 0);
		});
	});

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
			hoverMessage: pass ? "Test Passed" : "Test Failed" //results.map(x => x.error?.message).join("\n")			
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
