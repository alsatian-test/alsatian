import {
  FluentMatcherCore,
  FluentEntityMatcher,
  FluentPropertiesMatcher
} from "../matchers/fluent";
import { IFluentMatcherCore } from "../matchers/fluent/i-fluent-matcher-core";

/*tslint:disable*/
export let FluentExpect = <T>(value?: T): IFluentMatcherCore<T, null> => new FluentMatcherCore<T, null>(value, null, false);
