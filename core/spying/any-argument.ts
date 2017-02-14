import { TypeMatcher } from "../spying";

export function Any<ExpectedType extends Object>(
   type: new (...args: Array<any>) => ExpectedType
): TypeMatcher<ExpectedType> {
   return new TypeMatcher<ExpectedType>(type);
}
