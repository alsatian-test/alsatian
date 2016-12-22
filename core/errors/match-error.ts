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

  public constructor(message?: string, expectedValue?: any, actualValue?: any) {
    super(message);

    this._actual = actualValue;
    this._expected = expectedValue;
  }
}
