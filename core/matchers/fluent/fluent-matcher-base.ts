export class FluentMatcherBase<T, TParent> {
  constructor(
    protected actualValue: T,
    protected parent: TParent,
    protected invert: boolean = false
  ) {}

  /**
   * Inverts assertions, as in Expect(value).not.to.equal(something).
   * @param original The original boolean.
   */
  protected checkInvert(original: boolean): boolean {
    if (this.invert) {
      return !original;
    }

    return original;
  }

  /**
   * Returns " not " or "" depending on whether the chain up til this point is inverted.
   */
  protected get negation(): string {
    return this.invert ? " not " : " ";
  }

  /**
   * Returns a string representation of a function definition up to 500 characters long.
   * @param fn Function to stringify.
   */
  protected getFnString(fn: (...args: Array<any>) => any): string {
    const mAlias = fn.toString();
    return mAlias.substr(Math.max(mAlias.length, 500 /* fns can get long */));
  }
}
