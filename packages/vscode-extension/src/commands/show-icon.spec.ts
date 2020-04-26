import { TestFixture, Test, createFunctionSpy, Expect, Any, TestCase } from "alsatian";
import mock from "mock-require";
import { DecorationRenderOptions, Uri } from "vscode";

@TestFixture("showIcon() tests")
export class ShowIconTests {
    
    @Test("create decoration for whole line")
    public async wholeLine() {
        const fakeVscodeWindow = { createTextEditorDecorationType: createFunctionSpy() };
        mock("vscode", { window: fakeVscodeWindow });
		delete require.cache[require.resolve(`./show-icon.ts`)];
        const { showIcon } = await import("./show-icon");
        showIcon({ setDecorations: createFunctionSpy() } as any, null as any, null as any);

        Expect(fakeVscodeWindow.createTextEditorDecorationType)
            .not.toHaveBeenCalledWith(
                Any<DecorationRenderOptions>().thatMatches(x => x.isWholeLine === true));        
    }
    
    @Test("set gutter icon size to 'contain'")
    public async gutterIconSizeContain() {
        const fakeVscodeWindow = { createTextEditorDecorationType: createFunctionSpy() };
        mock("vscode", { window: fakeVscodeWindow });
		delete require.cache[require.resolve(`./show-icon.ts`)];
        const { showIcon } = await import("./show-icon");
        showIcon({ setDecorations: createFunctionSpy() } as any, null as any, null as any);

        Expect(fakeVscodeWindow.createTextEditorDecorationType)
            .toHaveBeenCalledWith(
                Any<DecorationRenderOptions>().thatMatches(x => x.gutterIconSize === "contain"));        
    }
    
    @TestCase("path")
    @TestCase("./another/icon.path")
    @Test("gutter icon path set")
    public async gutterIconPath(iconPath: Uri) {
        const fakeVscodeWindow = { createTextEditorDecorationType: createFunctionSpy() };
        mock("vscode", { window: fakeVscodeWindow });
		delete require.cache[require.resolve(`./show-icon.ts`)];
        const { showIcon } = await import("./show-icon");
        showIcon({ setDecorations: createFunctionSpy() } as any, iconPath, null as any);

        Expect(fakeVscodeWindow.createTextEditorDecorationType)
            .toHaveBeenCalledWith(
                Any<DecorationRenderOptions>().thatMatches(x => x.gutterIconPath === iconPath));        
    }
}
