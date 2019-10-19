import { Expect, Test } from "../../../core/alsatian-core";
import { InterfaceMatcher } from "../../../core/spying/interface-matcher";
import { TypeMatcher, Any } from "../../../core/spying";

export class InterfaceMatcherSpecs {

	@Test("calling thatMatches returns a TypeMatcher")
	public typeMatcherReturned() {
		const interfaceMatcher = new InterfaceMatcher();

		Expect(interfaceMatcher.thatMatches({})).toEqual(Any(TypeMatcher));
	}

	@Test("TypeMatcher test function works as expected")
	public testFunctionHookedUp() {
		const interfaceMatcher = new InterfaceMatcher<{ expected: string }>();

		const typeMatcher = interfaceMatcher.thatMatches("expected", "value");

		Expect(typeMatcher.test({ expected: "value" })).toBe(true);
		Expect(typeMatcher.test({ unexpected: "value" })).toBe(false);
		Expect(typeMatcher.test({ expected: "wrong value" })).toBe(false);
	}
}
