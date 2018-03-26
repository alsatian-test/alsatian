import { FluentMatcherBase } from "./fluent-matcher-base";
import { FluentEntityMatcher } from "./fluent-entity-matcher";
import { FluentPropertiesMatcher } from "./fluent-properties-matcher";
import { IContextualFluentMatcherCore } from "./i-contextual-fluent-matcher-core";
import { IFluentMatcherCore } from "./i-fluent-matcher-core";
import { IFluentEntityMatcher } from "./i-fluent-entity-matcher";
import { IContextualFluentEntityMatcher } from "./i-contextual-fluent-entity-matcher";
import { IFluentPropertiesMatcher } from "./i-fluent-properties-matcher";

/**
 * Core modifiers for describing expectations.
 */
export class FluentMatcherCore<T, TParent> 
  extends FluentMatcherBase<
  T,
  TParent
>
  implements IContextualFluentMatcherCore<T, TParent>, IFluentMatcherCore<T, TParent>
{
  constructor(
    protected actualValue: T,
    protected parent: TParent = null,
    protected invert: boolean = false
  ) {
    super(actualValue, parent);
  }

  public get with(): IFluentPropertiesMatcher<T, TParent> {
    return new FluentPropertiesMatcher(
      this.actualValue,
      this.parent,
      this.invert
    );
  }

  public get to(): IFluentEntityMatcher<T, TParent> {
    return new FluentEntityMatcher(this.actualValue, this.parent, this.invert);
  }

  public get that(): IContextualFluentEntityMatcher<T, TParent> {
    return new FluentEntityMatcher(this.actualValue, this.parent, this.invert);
  }

  /**
   * Negates the next (and only the next) assertion operator.
   */
  public get not(): FluentMatcherCore<T, TParent> {
    return new FluentMatcherCore(this.actualValue, this.parent, !this.invert);
  }

  /**
   * Conjunction operator that's currently superfluous, but available for clarity.
   */
  public get and(): FluentMatcherCore<T, TParent> {
    return new FluentMatcherCore(
      this.actualValue,
      this.parent,
      this.invert
    );
  }

  public get lastContextualValue(): T { return this.actualValue; }
}