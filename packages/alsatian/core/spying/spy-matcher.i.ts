import { MatcherOrType } from "./matcher-or-type";

export interface ISpyMatcher<ExpectedType extends object> {
	/* tslint:disable:unified-signatures */
	thatMatches<Key extends keyof ExpectedType>(key: Key, value: ExpectedType[Key]): MatcherOrType<ExpectedType>;
	thatMatches(properties: Partial<ExpectedType>): MatcherOrType<ExpectedType>;
	thatMatches(delegate: (argument: ExpectedType) => boolean): MatcherOrType<ExpectedType>;
	/* tslint:enable:unified-signatures */
}
