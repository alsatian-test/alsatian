import { IFluentPropertiesMatcher } from "./i-fluent-properties-matcher";
import { IContextualFluentEntityMatcher } from "./i-contextual-fluent-entity-matcher";

export interface IContextualFluentMatcherCore<T, TParent> {
    with: IFluentPropertiesMatcher<T, TParent>;
    that: IContextualFluentEntityMatcher<T, TParent>;
    not: IContextualFluentMatcherCore<T, TParent>;
    and: IContextualFluentMatcherCore<T, TParent>;
    lastContextualValue: T;
}