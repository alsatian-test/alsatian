import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { InterfaceMatcher } from "../../../core/spying/interface-matcher";
import { TypeMatcher, Any } from "../../../core/spying";

export class InterfaceMatcherSpecs {

	@Test("calling thatMatches returns a TypeMatcher")
	public typeMatcherReturned() {
		const interfaceMatcher = new InterfaceMatcher();

		Expect(interfaceMatcher.thatMatches({})).toEqual(Any(TypeMatcher));
	}

	@TestCase("expected", "value")
	@TestCase({ expected: "value" })
	@TestCase(x => x.expected === "value")
	@Test("TypeMatcher test function works as expected")
	public testFunctionHookedUp(first: any, second: any) {
		const interfaceMatcher = new InterfaceMatcher<{ expected: string }>();

		Object.keys(interfaceMatcher).forEach(k => interfaceMatcher[k] instanceof Function ? interfaceMatcher[k]() : null);

		const typeMatcher = interfaceMatcher.thatMatches(first, second);

		Expect(typeMatcher.test({ expected: "value" })).toBe(true);
		Expect(typeMatcher.test({ unexpected: "value" })).toBe(false);
		Expect(typeMatcher.test({ expected: "wrong value" })).toBe(false);
	}
}
