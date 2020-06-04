import { createFunctionSpy } from "alsatian";

export class VsCodeWindowBuilder {
    public build() {
        return {
            createTextEditorDecorationType: createFunctionSpy(),
            createOutputChannel: createFunctionSpy(),
            registerTreeDataProvider: createFunctionSpy()
        };
    }
}