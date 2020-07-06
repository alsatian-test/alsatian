import { findNearestFile } from "./find-nearest-file";
import { TestFixture, Test, Expect, TestCase, SpyOn } from "alsatian";
import { resolve, join } from "path";

@TestFixture("findNearestFile()")
export class FindNearestFileTests {

    @TestCase(undefined)
    @TestCase(null)
    @TestCase("")
    @Test("file name is required")
    public async fileNameRequired(noFileName: string) {
        await Expect(() => findNearestFile(noFileName)).toThrowErrorAsync(TypeError, "fileName is required.");
    }

    @TestCase("/")
    @TestCase("./folder/")
    @TestCase("/sub/folder/")
    @TestCase("../")
    @TestCase("..")
    @Test("file name must be a file")
    public async fileNameMustBeAFile(nonFileFileName: string) {
        await Expect(() => findNearestFile(nonFileFileName)).toThrowErrorAsync(TypeError, "fileName must be just a file, not a path or a file with a path.");
    }

    @Test("finds file in this directory")
    public async findFileInThisDirectory() {
        const directory = __dirname;

        const file = await findNearestFile("find-nearest-file.ts", directory);

        const expectedFile = resolve(directory, "./find-nearest-file.ts");

        Expect(file).toBe(expectedFile);
    }

    @Test("finds file in another directory")
    public async findFileInAnotherDirectory() {
        const directory = join(__dirname, "icons");

        const file = await findNearestFile("success.svg", directory);

        const expectedFile = resolve(directory, "./success.svg");

        Expect(file).toBe(expectedFile);
    }

    @Test("finds file in a parent directory")
    public async findsFileInParent() {
        const directory = join(__dirname, "icons");

        const file = await findNearestFile("find-nearest-file.ts", directory);

        const expectedFile = resolve(__dirname, "./find-nearest-file.ts");

        Expect(file).toBe(expectedFile);
    }

    @Test("finds file in a grand parent directory")
    public async findsFileInGrandParent() {
        const directory = join(__dirname, "commands");

        const file = await findNearestFile("package.json", directory);

        const expectedFile = resolve(__dirname, "../", "./package.json");

        Expect(file).toBe(expectedFile);
    }

    @Test("returns null if file doesn't exist")
    public async returnsNullForNonExistantFile() {
        const file = await findNearestFile("this-file-does-not.exist", __dirname);

        Expect(file).toBe(null);
    }

    @TestCase(__dirname)
    @TestCase(join(__dirname, "commands"))
    @TestCase(join(__dirname, "icons"))
    @TestCase(join(__dirname, "../samples"))
    @Test("defaults directory to current working directory")
    public async defaultToCurrentWorkingDirectory(workingDirectory: string) {
        SpyOn(process, "cwd").andReturn(workingDirectory);

        const file = await findNearestFile("package.json");

        const expectedFile = resolve(__dirname, "../", "./package.json");

        Expect(file).toBe(expectedFile);
    }
}
