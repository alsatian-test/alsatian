import { IFluentPropertiesMatcher } from "./i-fluent-properties-matcher";
import { IFluentEntityMatcher } from "./i-fluent-entity-matcher";

export interface IFluentMatcherCore<T, TParent> {
    with: IFluentPropertiesMatcher<T, TParent>;
    to: IFluentEntityMatcher<T, TParent>;
    not: IFluentMatcherCore<T, TParent>;
    and: IFluentMatcherCore<T, TParent>;
    lastContextualValue: T;
}