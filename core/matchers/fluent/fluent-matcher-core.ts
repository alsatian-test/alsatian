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
    protected parent: TParent,
    protected invert: boolean
  ) {
    super(actualValue, parent);
  }

  /** @inheritDoc */
  public get with(): IFluentPropertiesMatcher<T, TParent> {
    return new FluentPropertiesMatcher<T, TParent>(
      this.actualValue,
      this.parent,
      this.invert
    );
  }

  /** @inheritDoc */
  public get without(): IFluentPropertiesMatcher<T, TParent> {
    return new FluentPropertiesMatcher<T, TParent>(
      this.actualValue,
      this.parent,
      !this.invert
    );
  }

  /** @inheritDoc */
  public get to(): IFluentEntityMatcher<T, TParent> {
    return new FluentEntityMatcher<T, TParent>(this.actualValue, this.parent, this.invert);
  }

  /** @inheritDoc */
  public get that(): IContextualFluentEntityMatcher<T, TParent> {
    return new FluentEntityMatcher<T, TParent>(this.actualValue, this.parent, this.invert);
  }

  /** @inheritDoc */
  public get not(): FluentMatcherCore<T, TParent> {
    return new FluentMatcherCore(this.actualValue, this.parent, !this.invert);
  }

  /** @inheritDoc */
  public maybe(yayNay: boolean): FluentMatcherCore<T, TParent> {
    return new FluentMatcherCore(this.actualValue, this.parent, !yayNay);
  }

  /** @inheritDoc */
  public get and(): FluentMatcherCore<T, TParent> {
    return new FluentMatcherCore(
      this.actualValue,
      this.parent,
      this.invert
    );
  }

  /** @inheritDoc */
  public get lastContextualValue(): T { return this.actualValue; }
}