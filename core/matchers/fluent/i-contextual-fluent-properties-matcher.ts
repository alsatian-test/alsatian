import { SubsetPropertyAssertsDict, AllPropertyAssertsDict } from "./fluent-properties-matcher";
import { FluentMatcherCore } from "./fluent-matcher-core";
import { IFluentMatcherCore } from "./i-fluent-matcher-core";

export interface IContextualFluentPropertiesMatcher<T, TParent> {
    properties(subsetDict: SubsetPropertyAssertsDict<T>): IFluentMatcherCore<T, TParent>;
    allProperties(dict: AllPropertyAssertsDict<T>): IFluentMatcherCore<T, TParent>;
    keys<K extends keyof T>(
        expectedKeys: Array<K>
      ): IFluentMatcherCore<T, TParent>;
    elements(expected: Array<any>): IFluentMatcherCore<T, TParent>;
    
}