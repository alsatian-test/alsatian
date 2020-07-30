import { TextEditor } from "vscode";
import { createFunctionSpy } from "alsatian";

export class TextEditorBuilder {
    public build() {
        return {
            setDecorations: createFunctionSpy()
        } as unknown as TextEditor;
    }
}