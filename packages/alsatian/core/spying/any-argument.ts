import { TypeMatcher } from "../spying";

export function Any<ExpectedType extends object>(
	type: new (...args: Array<any>) => ExpectedType
): TypeMatcher<ExpectedType> {
	return new TypeMatcher<ExpectedType>(type);
}
