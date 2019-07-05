import { TypeMatcher } from "../spying";

export function Any<ExpectedType extends object>(
	type: new (...args: Array<any>) => ExpectedType
): TypeMatcher<ExpectedType> & ExpectedType {
	return new TypeMatcher<ExpectedType>(type) as TypeMatcher<ExpectedType> & ExpectedType;
}
