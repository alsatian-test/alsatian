import ExtendoError from "extendo-error";

export class MatchError extends ExtendoError {

  private _actualValue: any;
  public get actualValue(): any {
    return this._actualValue;
  }

  private _expectedValue: any;
  public get expectedValue(): any {
    return this._expectedValue;
  }

  public constructor(actualValue: any, expectedValue: any, message: string) {
    super(message);

    this._actualValue = actualValue;
    this._expectedValue = expectedValue;
  }
}
