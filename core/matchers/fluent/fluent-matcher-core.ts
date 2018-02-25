import { FluentMatcherBase } from "./fluent-matcher-base";
import { FluentMatcher } from "./fluent-matcher";
import { FluentPropertiesMatcher } from "./fluent-properties-matcher";

export class FluentMatcherCore<T> extends FluentMatcherBase<T> {
  constructor(
    protected actualValue: T,
    protected parent: FluentMatcherBase<T> = null,
    protected invert: boolean = false
  ) {
    super(actualValue, parent);
  }
  public get to(): FluentMatcher<T> {
    return new FluentMatcher<T>(this.actualValue, this, this.invert);
  }
  public get with(): FluentPropertiesMatcher<T> {
    return new FluentPropertiesMatcher<T>(this.actualValue, this, this.invert);
  }
  public get not(): FluentMatcherCore<T> {
    return new FluentMatcherCore<T>(
      this.actualValue,
      this.parent,
      !this.invert
    );
  }
}
