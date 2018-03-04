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

  public get not(): FluentMatcherCore<T, TParent> {
    return new FluentMatcherCore(this.actualValue, this.parent, !this.invert);
  }
}
