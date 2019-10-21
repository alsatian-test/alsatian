import { MatcherOrType } from "./matcher-or-type";
import { TypeMatcher } from "./type-matcher";
import { MatcherArgument } from "./matcher-argument";
import { ISpyMatcher } from "./spy-matcher.i";

export class InterfaceMatcher<ExpectedType extends object> implements ISpyMatcher<ExpectedType> {
	public thatMatches<Key extends keyof ExpectedType>(
		first: MatcherArgument<ExpectedType, Key>,
		second?: ExpectedType[Key]
	): MatcherOrType<ExpectedType> {
		return new TypeMatcher<ExpectedType>(Object as any).thatMatches(first as Key, second);
	}
}
