import { commands, CodeLens, CodeLensProvider, Command, DocumentSymbol, SymbolInformation, SymbolKind, TextDocument, debug } from "vscode";

export class AlsatianCodeLensProvider implements CodeLensProvider {
    async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {

        const symbols: Array<DocumentSymbol> | undefined = await commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri);

        if (symbols === undefined) {
            return [];
        }

        const methods = symbols[0].children.filter(x => x.kind === SymbolKind.Method)
                        .filter(method => /@(Test|TestCase|AsyncTest)\(/.test(document.getText(method.range)));

        const runTestCommand: Command = {
            command: "alsatian.runTest",
            title: "$(play) Run",
        };

        const debugTestCommand: Command = {
            command: "extension.runTest",
            title: "$(debug) Debug",
        };

        return methods.map(x => new CodeLens(x.range, { ...runTestCommand, arguments: [ document.fileName, x.name, x.selectionRange ] }))
                .concat(methods.map(x => new CodeLens(x.range, { ...debugTestCommand, arguments: [ document.fileName, x.name ] })));
    }
}
