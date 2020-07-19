import { GlobHelper, TestLoader, FileRequirer } from "../../../core/";
import { Expect, SpyOn, Test, TestCase } from "../../../core/alsatian-core";
import { TestSet } from "../../../core/test-set";
import { resolve, sep } from "path";

export class LoadTestTests {
	@Test()
	public noTestsAtLocationGivesNoTestFixtures() {
		const testLoader = new TestLoader(new FileRequirer());
		const testLoaderSpy = SpyOn(testLoader, "loadTestFixture");
		testLoaderSpy.andReturn([]);
		testLoaderSpy.andStub();

		const globHelper = new GlobHelper();
		SpyOn(globHelper, "isGlob").andReturn(false);

		const testSet = new TestSet(testLoader, globHelper);

		testSet.addTestsFromFiles("no-tests");

		Expect(testSet.testFixtures.length).toBe(0);
	}

	@TestCase("/test/spec.js")
	@TestCase("/another/spec.somewhere.js")
	@Test("absolute paths are resolved")
	public absolutePathsAreResolved(path: string) {
		const testLoader = new TestLoader(new FileRequirer());
		const testLoaderSpy = SpyOn(testLoader, "loadTestFixture");
		testLoaderSpy.andReturn([]);
		testLoaderSpy.andStub();

		const globHelper = new GlobHelper();
		SpyOn(globHelper, "isGlob").andReturn(false);

		const testSet = new TestSet(testLoader, globHelper);

		testSet.addTestsFromFiles(path);

		Expect(testLoader.loadTestFixture).toHaveBeenCalledWith(resolve(path));
	}

	@TestCase("./spec.js")
	@TestCase("spec.somewhere.js")
	@TestCase("../another.test.js")
	@Test("relative paths are resolved")
	public relativePathsAreResolved(path: string) {
		const testLoader = new TestLoader(new FileRequirer());
		const testLoaderSpy = SpyOn(testLoader, "loadTestFixture");
		testLoaderSpy.andReturn([]);
		testLoaderSpy.andStub();

		const globHelper = new GlobHelper();
		SpyOn(globHelper, "isGlob").andReturn(false);

		const testSet = new TestSet(testLoader, globHelper);

		testSet.addTestsFromFiles(path);

		Expect(testLoader.loadTestFixture).toHaveBeenCalledWith(resolve(path));
	}

	@TestCase("/*/spec.js")
	@TestCase("/another/**/*.spec.somewhere.js")
	@Test("absolute globs are resolved")
	public absoluteGlobsAreResolved(path: string) {
		const testLoader = new TestLoader(new FileRequirer());
		const testLoaderSpy = SpyOn(testLoader, "loadTestFixture");
		testLoaderSpy.andReturn([]);
		testLoaderSpy.andStub();

		const globHelper = new GlobHelper();
		SpyOn(globHelper, "resolve").andReturn([]);

		const testSet = new TestSet(testLoader, globHelper);

		testSet.addTestsFromFiles(path);

		Expect(globHelper.resolve).toHaveBeenCalledWith(resolve(path));
	}

	@TestCase("./*.js")
	@TestCase("**/*.js")
	@TestCase("../*.test.js")
	@Test("relative globs are resolved")
	public relativeGlobsAreResolved(path: string) {
		const testLoader = new TestLoader(new FileRequirer());
		const testLoaderSpy = SpyOn(testLoader, "loadTestFixture");
		testLoaderSpy.andReturn([]);
		testLoaderSpy.andStub();

		const globHelper = new GlobHelper();
		SpyOn(globHelper, "resolve").andReturn([]);

		const testSet = new TestSet(testLoader, globHelper);

		testSet.addTestsFromFiles(path);

		Expect(globHelper.resolve).toHaveBeenCalledWith(resolve(path));
	}

	// @TestCase("file.js", "another-file.ts")
	// @TestCase("singlefile.js")
	// @TestCase("path/and/file.ts", "./path/relative/file.ts")
	// @Test("resolved files are loaded")
	// public resolvedFilesAreLoaded(... fileLocations: Array<string>) {
	// 	const testLoader = new TestLoader(null);
	// 	const testLoaderSpy = SpyOn(testLoader, "loadTestFixture");
	// 	testLoaderSpy.andReturn([]);
	// 	testLoaderSpy.andStub();

	// 	const globHelper = new GlobHelper();
	// 	SpyOn(globHelper, "resolve").andReturn(fileLocations);

	// 	const testSet = new TestSet(testLoader, globHelper);

	// 	testSet.addTestsFromFiles("**/*/glob");

	// 	fileLocations.forEach(fileLocation => {
	// 		Expect(testLoader.loadTestFixture).toHaveBeenCalledWith(fileLocation);
	// 	});
	// }
}
