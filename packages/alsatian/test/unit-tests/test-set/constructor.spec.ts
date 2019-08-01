import { GlobHelper, TestLoader } from "../../../core/";
import { Expect, TestCase } from "../../../core/alsatian-core";
import { TestSet } from "../../../core/test-set";

export class TestSetConstructorTests {
	@TestCase(null)
	@TestCase(undefined)
	public nullOrUndefinedTestLoaderThrowsError(testLoader: TestLoader) {
		const globHelper = new GlobHelper();

		Expect(() => new TestSet(testLoader, globHelper)).toThrowError(
			TypeError,
			"testLoader must not be null or undefined."
		);
	}

	@TestCase(null)
	@TestCase(undefined)
	public nullOrUndefinedGlobHelperThrowsError(globHelper: GlobHelper) {
		const testLoader = new TestLoader(null);

		Expect(() => new TestSet(testLoader, globHelper)).toThrowError(
			TypeError,
			"globHelper must not be null or undefined."
		);
	}
}
