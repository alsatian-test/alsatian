import mock from "mock-require";
import { VsCodeWindowBuilder } from "./vscode-window-builder";
import { createFunctionSpy } from "alsatian";

mock("vscode", {
    TreeItem: class TreeItem {},
    EventEmitter: class EventEmitter {
        event = createFunctionSpy();
    },
    window: new VsCodeWindowBuilder().build(),
    commands: {
        registerCommand: createFunctionSpy()
    },
    workspace: {
        rootPath: "."
    }
});
