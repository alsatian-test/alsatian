import { TypeMatcher } from "./type-matcher";

export type MatcherOrType<Type extends object> = TypeMatcher<Type> | Type;
