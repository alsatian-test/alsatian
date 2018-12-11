import { Expect, TestCase } from "../../../core/alsatian-core";
import { Any } from "../../../core/spying/any-argument";
import { TypeMatcher } from "../../../core/spying/type-matcher";

export class AnyArgumentsTests {
	@TestCase(null)
	@TestCase(undefined)
	public nullOrUndefinedTypesThrowError(type: any) {
		Expect(() => Any(type)).toThrowError(
			TypeError,
			"type must not be null or undefined"
		);
	}

	@TestCase(Number)
	@TestCase(String)
	@TestCase(Boolean)
	@TestCase(Array)
	@TestCase(Object)
	@TestCase(Error)
	public anyReturnsTypeMatcher(type: new (...args: Array<any>) => object) {
		Expect(Any(type) instanceof TypeMatcher).toBe(true);
	}
}
