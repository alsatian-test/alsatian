import { commands, CodeLens, CodeLensProvider, Command, DocumentSymbol, SymbolInformation, SymbolKind, TextDocument, debug } from "vscode";

export class AlsatianCodeLensProvider implements CodeLensProvider {
    async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {

        const symbols: Array<DocumentSymbol> | undefined = await commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri);

        if (symbols === undefined) {
            return [];
        }

        const classes = symbols.filter(symbol => symbol.kind === SymbolKind.Class);

        const fixtures = classes.map(c => ({
            className: c.name,
            range: c.range,
            tests: c.children.filter(child => child.kind === SymbolKind.Method)
                             .filter(method => /@(Test|TestCase|AsyncTest)\(/.test(document.getText(method.range)))
        })).filter(fixture => fixture.tests.length > 0);

        const runFixtureTestsCommand: Command = {
            command: "alsatian.runFixtureTest",
            title: "$(play) Run All",
        };
        
        const lenses = fixtures.map(fixture => new CodeLens(fixture.range, { ...runFixtureTestsCommand, arguments: [ document.fileName, fixture ]}));

        const runTestCommand: Command = {
            command: "alsatian.runTest",
            title: "$(play) Run",
        };

        const debugTestCommand: Command = {
            command: "alsatian.debugTest",
            title: "$(debug) Debug",
        };

        const tests = fixtures.reduce<DocumentSymbol[]>((allTests, fixture) => allTests.concat(fixture.tests), []);

        return lenses
            .concat(tests.map(test => 
                    new CodeLens(
                        test.range,
                        { ...runTestCommand, arguments: [ document.fileName, test.name, test.selectionRange ]}
                    )
                )
            )            
            .concat(tests.map(test => 
                    new CodeLens(
                        test.range,
                        { ...debugTestCommand, arguments: [ document.fileName, test.name, test.selectionRange ]}
                    )
                )
            );
    }
}
