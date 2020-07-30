import { ExtensionContext } from "vscode";
import { createFunctionSpy } from "alsatian";

export class ExtensionContextBuilder {
    public build() {
        return {
            subscriptions: []
        } as unknown as ExtensionContext;
    }
}
