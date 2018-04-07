import { IFluentPropertiesMatcher } from "./i-fluent-properties-matcher";
import { IContextualFluentEntityMatcher } from "./i-contextual-fluent-entity-matcher";

export interface IContextualFluentMatcherCore<T, TParent> {
  /**
   * Chooses from complex type operations, e.g., object property and array matchers.
   */
  with: IFluentPropertiesMatcher<T, TParent>;

  /**
   * Convenience method for .not.with.
   */
  without: IFluentPropertiesMatcher<T, TParent>;

  /**
   * Chooses from primitive entity operations.
   */
  that: IContextualFluentEntityMatcher<T, TParent>;

  /**
   * No-op that serves to grammatically beautify.
   */
  and: IContextualFluentMatcherCore<T, TParent>;

  /**
   * Gets the last contextual value in the fluent chain. This begins with
   * Expect(firstContextualValue) and can be narrowed via has(...), throws(...), etc.
   */
  lastContextualValue: T;

  /**
   * Negates the next item in the fluent chain. E.g., Expect(val).not.to.equal(3).
   */
  not: IContextualFluentMatcherCore<T, TParent>;

  /**
   * A conditional version of 'not' designed to facilitate test parameterization.
   * Using maybe(false) is equivalent to using not.
   * @param yayNay Boolean representing whether the next term should remain unnegated.
   */
  maybe(yayNay: boolean): IContextualFluentMatcherCore<T, TParent>;
}
