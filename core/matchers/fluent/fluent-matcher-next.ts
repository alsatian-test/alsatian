import { FluentMatcherBase } from "./fluent-matcher-base";

export class FluentMatcherNext<T> extends FluentMatcherBase<T> {
  constructor(
    protected actualValue: T,
    protected parent: FluentMatcherBase<T>,
    protected invert: boolean = false
  ) {
    super(actualValue, parent, invert);
  }
}
