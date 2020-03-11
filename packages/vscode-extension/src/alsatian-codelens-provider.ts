import { commands, CodeLens, CodeLensProvider, Command, DocumentSymbol, SymbolInformation, SymbolKind, TextDocument, debug } from "vscode";
import { RunTestCommand } from "./commands/run-test-command";
import { DebugTestCommand } from "./commands/debug-test-command";
import { RunTestFixtureCommand } from "./commands/run-test-fixture-command";

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
        })).filter(fixture => fixture.tests.length >  0);
        
        const lenses = fixtures.map(fixture => new CodeLens(fixture.range, { ...RunTestFixtureCommand.details, arguments: [ document.fileName, fixture ]}));

        const tests = fixtures.reduce<(DocumentSymbol& { fixtureName: string })[]>((allTests, fixture) => allTests.concat(fixture.tests.map(test => ({ ...test, fixtureName: fixture.className }))), []);

        return lenses
            .concat(tests.map(test => 
                    new CodeLens(
                        test.range,
                        { ...RunTestCommand.details, arguments: [ document.fileName, test.fixtureName, test.name, test.selectionRange ]}
                    )
                )
            )            
            .concat(tests.map(test => 
                    new CodeLens(
                        test.range,
                        { ...DebugTestCommand.details, arguments: [ document.fileName, test.fixtureName, test.name, test.selectionRange ]}
                    )
                )
            );
    }
}
