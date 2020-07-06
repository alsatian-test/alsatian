
import { window, Uri, Range, TextEditor, DecorationOptions } from "vscode";

export function showIcon(editor: TextEditor, icon: Uri, options: Range[] | DecorationOptions[]) {
    const runningDecorator = window.createTextEditorDecorationType({
        isWholeLine: true,
        gutterIconPath: icon,
        gutterIconSize: "contain"
    });
    
    editor.setDecorations(runningDecorator, options);
    return runningDecorator;
}
