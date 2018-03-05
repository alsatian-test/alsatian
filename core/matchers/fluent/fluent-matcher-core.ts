import { FluentMatcherBase } from "./fluent-matcher-base";
import { FluentEntityMatcher } from "./fluent-entity-matcher";
import { FluentPropertiesMatcher } from "./fluent-properties-matcher";

export class FluentMatcherCore<T, TParent> extends FluentMatcherBase<
  T,
  TParent
> {
  constructor(
    protected actualValue: T,
    protected parent: TParent = null,
    protected invert: boolean = false
  ) {
    super(actualValue, parent);
  }
  public get to(): FluentEntityMatcher<T, TParent> {
    return new FluentEntityMatcher(this.actualValue, this.parent, this.invert);
  }

  public get with(): FluentPropertiesMatcher<T, TParent> {
    return new FluentPropertiesMatcher(
      this.actualValue,
      this.parent,
      this.invert
    );
  }

  /**
   * Negates the next (and only the next) assertion operator.
   */
  public get not(): FluentMatcherCore<T, TParent> {
    return new FluentMatcherCore(this.actualValue, this.parent, !this.invert);
  }
}

export class NextFluentMatcherCore<T, TParent> extends FluentMatcherCore<
  T,
  TParent
> {
  constructor(
    protected actualValue: T,
    protected parent: TParent,
    protected invert: boolean
  ) {
    super(actualValue, parent); /* istanbul ignore next */
  }

  /**
   * Conjunction operator that's currently superfluous, but available for clarity.
   */
  public get and(): NextFluentMatcherCore<T, TParent> {
    return new NextFluentMatcherCore(
      this.actualValue,
      this.parent,
      this.invert
    );
  }
}
