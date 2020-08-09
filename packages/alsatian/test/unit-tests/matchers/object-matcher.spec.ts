import { Expect, TestCase, MatchError } from "../../../core/alsatian-core";
import { ObjectMatcher } from "../../../core/matchers";

export class FunctionSpyMatcherTests {
	@TestCase(123)
	public objectsComparisonReturnsResultWithoutError(value: number) {
		const objectMatcher = new ObjectMatcher<{
			test: number
		}>({
			test: value
		});

		Expect(() => objectMatcher.toEqual({ test: 2 })).toThrowError(MatchError, "Expected objects to be equal");
	}
}
