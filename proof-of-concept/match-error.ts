export class MatchError extends Error {

  private _actualValue: any;
  public get actualValue(): any {
    return this._actualValue;
  }

  private _expectedValue: any;
  public get expectedValue(): any {
    return this._expectedValue;
  }

  private _message: string;
  public get message(): string {
    return this._message;
  }

  public constructor(actualValue: any, expectedValue: any, shouldMatch: boolean) {
    super();
    this._message = "Expected " + JSON.stringify(actualValue);
    if (!shouldMatch) {
      this._message += " not";
    }
    this._message += " to be " + JSON.stringify(expectedValue) + ".";
    this._actualValue = actualValue;
    this._expectedValue = expectedValue;
  }
}
