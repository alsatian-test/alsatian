import { AlsatianCommand } from "./alsatian-command";
import { workspace, window, SymbolKind, commands, DocumentSymbol } from "vscode";

export class OpenSpecCommand extends AlsatianCommand {
    protected static commandName = "openSpec";
    public static title = "Open Spec";
    
    public static async execute(fileName: string, symbol?: string) {
        const document = await workspace.openTextDocument(fileName);
        const editor = await window.showTextDocument(document);

        if (!symbol) {
            return;
        }

        const documentSymbols: Array<DocumentSymbol> | undefined = await commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri);

        if (documentSymbols === undefined) {
            return;
        }

        const method = documentSymbols.filter(documentSymbol => documentSymbol.kind === SymbolKind.Class)
                                       .map(classes => classes.children)
                                       .reduce((allSymbols, classSymbol) => allSymbols.concat(classSymbol), [])
                                       .filter(classSymbol => classSymbol.kind === SymbolKind.Method)
                                       .find(method => method.name === symbol);

        if (!method) {
            return;
        }

        editor.revealRange(method.range);
    }
}