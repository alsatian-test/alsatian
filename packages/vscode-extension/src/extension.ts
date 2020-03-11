import { commands, debug, ExtensionContext, languages, window, TextEditorDecorationType, Range, Uri, Position } from "vscode";
import { AlsatianCodeLensProvider } from "./alsatian-codelens-provider";
import { fork } from "child_process";
import { ITestCompleteEvent } from "alsatian/dist/core/events";
import { TestOutcome } from "alsatian";

let successPath: string;
let failurePath: string;
let runningPath: string;
const styles: { [key: string]: TextEditorDecorationType } = {

};

async function runFixtureTests(fileName: string, fixture: any) {
	const range = fixture.range;
	
	// need to make more robust (perhaps pass in document instead)
	const editor = window.visibleTextEditors.filter(x => x.document.fileName === fileName)[0];

	const runningDecorator = window.createTextEditorDecorationType({
		gutterIconPath: Uri.file(runningPath),
		gutterIconSize: "contain"
	});

	//TODO: may need to push this to the background in order for the change to apply I guess the thread is locked
	//      preventing update / may want to use vscode's EventEmitter
	editor.setDecorations(runningDecorator, [{range: new Range(range.start, range.start)}]);

	//TODO: this is likely inefficient and can be refactored to avoid loading the document multiple times
	await Promise.all(
		fixture.tests.map((test: any) => runTest(fileName, fixture.className, test.name, test.selectionRange))
	);

	runningDecorator.dispose();
}

async function debugTest(fileName: string, fixtureName: string, testName: string, range: Range) {
	const debuggerPort = 40894;
	// process.execArgv.push('--debug=' + (debuggerPort));
	debug.startDebugging(
		undefined,
		{
			name: "alsatian debugging",
			type: 'node',
			request: 'attach',
			port: debuggerPort,
			protocol: 'inspector',
			timeout: 5000,
			stopOnEntry: false
		}
	);
	runTest(fileName, fixtureName, testName, range, ['--inspect-brk=' + (debuggerPort)]);
}

async function runTest(fileName: string, fixtureName: string, testName: string, range: Range, execArgv?: string[]) {
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

	const runProcess = fork(`${__dirname}/run`, [ fileName, fixtureName, testName ], { execArgv });

	const results = await new Promise<ITestCompleteEvent[] | null>((resolve, reject) => {
		runProcess.on("message", message => {
			if (message.type === "testComplete") {
				resolve(message.results);
			}
		});

		runProcess.on("exit", code => {
			resolve(null);
		});
	});	

	const pass = results && results.every(x => x.outcome === TestOutcome.Pass);

	const iconPath = Uri.file(pass ? successPath : failurePath);

	const resultDecoration = window.createTextEditorDecorationType({
		isWholeLine: true,
		gutterIconPath: iconPath,
		gutterIconSize: "contain"	
	});

	const errors = results?.filter(result => result.error).map(result => result.error) || [];

	styles[testName] = resultDecoration;

	// new EventEmitter().fire({ type: "test", test: testName, state: pass ? "passed" : "failed" });
	runningDecorator.dispose();
	editor.setDecorations(resultDecoration, [
		{
			range: new Range(range.start, range.start),
			renderOptions: {
				after: {
					margin: "2em",
					contentText: errors[0] ? errors[0].message || (errors[0] as any)._message || "An unknown error ocurred" : "",
					color: "#f44"
				}
			},	
		}
	]);

	console.log(`run ${testName} resulted in ${pass ? "success" : "failure"}`);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	context.subscriptions.push(
		commands.registerCommand(
			"alsatian.runFixtureTest",
			runFixtureTests
		)
	);

	context.subscriptions.push(
		commands.registerCommand(
			"alsatian.runTest",
			runTest
		)
	);

	context.subscriptions.push(
		commands.registerCommand(
			"alsatian.debugTest",
			debugTest
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
