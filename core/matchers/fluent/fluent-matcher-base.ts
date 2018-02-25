export class FluentMatcherBase<T> {
  constructor(
    protected actualValue: T,
    protected parent: FluentMatcherBase<T>,
    protected invert: boolean = false
  ) {}

  protected checkInvert(original: boolean): boolean {
    if (this.invert) {
      return !original;
    }

    return original;
  }

  protected get negation(): string {
    return this.invert ? " not " : "";
  }
}
