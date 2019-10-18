import { MatcherOrType } from "./matcher-or-type";
import { TypeMatcher } from "./type-matcher";
export type MatcherArgument<ExpectedType, Key extends keyof ExpectedType> = Key | Partial<ExpectedType> | ((argument: ExpectedType) => boolean);

export class InterfaceMatcher<ExpectedType extends object> {
	public thatMatches<Key extends keyof ExpectedType>(key: Key, value: ExpectedType[Key]): MatcherOrType<ExpectedType>;
	public thatMatches(properties: Partial<ExpectedType>): MatcherOrType<ExpectedType>;
	public thatMatches(delegate: (argument: ExpectedType) => boolean): MatcherOrType<ExpectedType>;
	public thatMatches<Key extends keyof ExpectedType>(
		first: MatcherArgument<ExpectedType, Key>,
		second?: ExpectedType[Key]
	): MatcherOrType<ExpectedType> {
		return new TypeMatcher<ExpectedType>(Object as any).thatMatches(first as Key, second);
	}
}
