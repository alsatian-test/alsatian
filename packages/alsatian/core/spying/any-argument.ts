import { TypeMatcher } from "../spying";
import { InterfaceMatcher } from "./interface-matcher";
import { MatcherOrType } from "./matcher-or-type";

export function Any<ExpectedType extends object>(): InterfaceMatcher<ExpectedType>;
export function Any<ExpectedType extends object>(type: new (...args: Array<any>) => ExpectedType): MatcherOrType<ExpectedType>;
export function Any<ExpectedType extends object>(
	type?: new (...args: Array<any>) => ExpectedType
): MatcherOrType<ExpectedType> | InterfaceMatcher<ExpectedType> {
	if (type) {
		return new TypeMatcher<ExpectedType>(type) as MatcherOrType<ExpectedType>;
	}

	return new InterfaceMatcher<ExpectedType>();
}
