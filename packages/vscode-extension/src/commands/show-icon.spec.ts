// import { TestFixture, Test, createFunctionSpy, Expect, Any, TestCase } from "alsatian";
// import "../test/setup-vscode-environment";
// import { DecorationRenderOptions, Uri } from "vscode";
// import { TextEditorBuilder } from "../test/text-editor-builder";
// import { VsCodeWindowBuilder } from "../test/vscode-window-builder";
// import mock from "mock-require";

// @TestFixture("showIcon() tests")
// export class ShowIconTests {
    
//     @Test("create decoration for whole line")
//     public async wholeLine() {
//         const fakeVscodeWindow = new VsCodeWindowBuilder().build();
//         mock("vscode", { window: fakeVscodeWindow });
// 		delete require.cache[require.resolve(`./show-icon.ts`)];
//         const { showIcon } = await import("./show-icon");
//         showIcon(new TextEditorBuilder().build(), {} as Uri, []);

//         Expect(fakeVscodeWindow.createTextEditorDecorationType)
//             .toHaveBeenCalledWith(
//                 Any<DecorationRenderOptions>().thatMatches(x => x.isWholeLine === true));        
//     }
    
//     @Test("set gutter icon size to 'contain'")
//     public async gutterIconSizeContain() {
//         const fakeVscodeWindow = new VsCodeWindowBuilder().build();
//         mock("vscode", { window: fakeVscodeWindow });
// 		delete require.cache[require.resolve(`./show-icon.ts`)];
//         const { showIcon } = await import("./show-icon");
//         showIcon(new TextEditorBuilder().build(), {} as Uri, []);

//         Expect(fakeVscodeWindow.createTextEditorDecorationType)
//             .toHaveBeenCalledWith(
//                 Any<DecorationRenderOptions>().thatMatches(x => x.gutterIconSize === "contain"));        
//     }
    
//     @TestCase("path")
//     @TestCase("./another/icon.path")
//     @Test("gutter icon path set")
//     public async gutterIconPath(iconPath: Uri) {
//         const fakeVscodeWindow = { createTextEditorDecorationType: createFunctionSpy() };
//         mock("vscode", { window: fakeVscodeWindow });
// 		delete require.cache[require.resolve(`./show-icon.ts`)];
//         const { showIcon } = await import("./show-icon");
//         showIcon(new TextEditorBuilder().build(), iconPath, []);

//         Expect(fakeVscodeWindow.createTextEditorDecorationType)
//             .toHaveBeenCalledWith(
//                 Any<DecorationRenderOptions>().thatMatches(x => x.gutterIconPath === iconPath));        
//     }
// }
