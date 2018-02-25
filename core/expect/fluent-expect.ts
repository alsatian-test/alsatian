import { FluentMatcherCore } from "../matchers/fluent";

/*tslint:disable*/
export let FluentExpect = <T>(value: T) => new FluentMatcherCore<T>(value);
