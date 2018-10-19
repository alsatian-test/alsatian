import ExtendoError from "extendo-error";

export class MatchError extends ExtendoError {
  protected _actual: any;
  public get actual(): any {
    return this._actual;
  }

  protected _expected: any;
  public get expected(): any {
    return this._expected;
  }

  protected _extras: { [prop: string]: any };
  public get extras(): { [prop: string]: any } {
    return this._extras;
  }

  public constructor(
    message?: string,
    expectedValue?: any,
    actualValue?: any,
    extras?: { [prop: string]: any }
  ) {
    super(message);

    this._actual = actualValue;
    this._expected = expectedValue;
    this._extras = extras;
  }
}
