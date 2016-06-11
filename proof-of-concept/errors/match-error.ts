export class MatchError extends Error {

  private _actualValue: any;
  public get actualValue(): any {
    return this._actualValue;
  }

  private _expectedValue: any;
  public get expectedValue(): any {
    return this._expectedValue;
  }

  protected _message: string;
  public get message(): string {
    return this._message;
  }

  public constructor(actualValue: any, expectedValue: any, message: string) {
    super(message);

    this._message = message;
    this._actualValue = actualValue;
    this._expectedValue = expectedValue;
  }
}
