import { MatcherOrType } from "./matcher-or-type";
import { TypeMatcher } from "./type-matcher";
import { SpyMatcher } from "./spy-matcher";

export class InterfaceMatcher<ExpectedType extends object> implements SpyMatcher<ExpectedType> {
	public thatMatches<Key extends keyof ExpectedType>(
		first: Key | Partial<ExpectedType> | ((argument: ExpectedType) => boolean),
		second?: ExpectedType[Key]
	): MatcherOrType<ExpectedType> {
		return new TypeMatcher<ExpectedType>(Object as any).thatMatches(first as Key, second);
	}
}
