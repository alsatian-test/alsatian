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

  protected _fileName: string;
  public get fileName(): string {
    return this._fileName;
  }
  public set fileName(v: string) {
    this._fileName = v;
  }

  protected _lineNumber: number;
  public get lineNumber(): number {
    return this._lineNumber;
  }
  public set lineNumber(v: number) {
    this._lineNumber = v;
  }

  protected _columnNumber: number;
  public get columnNumber(): number {
    return this._columnNumber;
  }
  public set columnNumber(v: number) {
    this._columnNumber = v;
  }

  public constructor(message?: string, expectedValue?: any, actualValue?: any) {
    super(message);

    this._actual = actualValue;
    this._expected = expectedValue;
    this._fileName = "";
    this._lineNumber = -1;
    this._columnNumber = -1;
  }
}
