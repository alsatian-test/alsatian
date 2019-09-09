import { MatcherOrType } from "./matcher-or-type";
import { TypeMatcher } from "./type-matcher";

export class InterfaceMatcher<ExpectedType extends object> {
	public thatMatches<Key extends keyof ExpectedType>(key: Key, value: ExpectedType[Key]): MatcherOrType<ExpectedType>;
	public thatMatches(properties: Partial<ExpectedType>): MatcherOrType<ExpectedType>;
	public thatMatches(delegate: (argument: ExpectedType) => boolean): MatcherOrType<ExpectedType>;
	public thatMatches<Key extends keyof ExpectedType>(
		first: Key | Partial<ExpectedType> | ((argument: ExpectedType) => boolean),
		second?: ExpectedType[Key]
	): MatcherOrType<ExpectedType> {
		return new TypeMatcher<ExpectedType>(Object as any).thatMatches(first as Key, second) as MatcherOrType<ExpectedType>;
	}
}
