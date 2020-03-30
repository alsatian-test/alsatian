import { Expect, Test, TestFixture, createFunctionSpy, SpyOn, TestCase } from "alsatian";
import { Icons } from ".";
import { ExtensionContext, Uri } from "vscode";

@TestFixture("icon tests")
export class IconTests {

    @TestCase("/absolute/file/path")
    @TestCase("/another/location.png")
    @TestCase("c:\\some\\windows\\path.exe")
    @Test("running icon resolved from absolute path")
    public runningIcon(absolutePath: string) {
        const context = {
            asAbsolutePath: createFunctionSpy().andReturn(absolutePath)
        } as unknown as ExtensionContext;

        SpyOn(Uri, "file");

        Icons.getTestRunningIconPath(context);

        Expect(context.asAbsolutePath).toHaveBeenCalledWith("src/icons/running.svg");
        Expect(Uri.file).toHaveBeenCalledWith(absolutePath)
    }
}
