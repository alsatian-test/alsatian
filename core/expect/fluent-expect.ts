import {
  FluentMatcherCore,
  FluentEntityMatcher,
  FluentPropertiesMatcher
} from "../matchers/fluent";

/*tslint:disable*/
export let FluentExpect = <T>(value?: T) => new FluentMatcherCore<T, null>(value);
