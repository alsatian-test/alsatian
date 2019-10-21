export type MatcherArgument<ExpectedType, Key extends keyof ExpectedType> = Key
																			| Partial<ExpectedType>
																			| ((argument: ExpectedType) => boolean);
