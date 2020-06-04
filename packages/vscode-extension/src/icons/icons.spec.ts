import { Expect, Test, TestFixture, createFunctionSpy, SpyOn, TestCase } from "alsatian";
import mock from "mock-require";
import { ExtensionContext } from "vscode";

@TestFixture("icon tests")
export class IconTests {

    @TestCase("/absolute/file/path")
    @TestCase("/another/location.png")
    @TestCase("c:\\some\\windows\\path.exe")
    @Test("running icon resolved from absolute path")
    public async runningIcon(absolutePath: string) {
        const asAbsolutePath = createFunctionSpy();
        asAbsolutePath.andReturn(absolutePath);
        const context = {
            asAbsolutePath
        } as unknown as ExtensionContext;

        const UriMock = { file: createFunctionSpy() };
        mock("vscode", { Uri: UriMock });
        delete require.cache[require.resolve(".")];
        const { Icons } = await import(".");

        Icons.getTestRunningIconPath(context);

        Expect(context.asAbsolutePath).toHaveBeenCalledWith("src/icons/running.svg");
        Expect(UriMock.file).toHaveBeenCalledWith(absolutePath);
    }
}
