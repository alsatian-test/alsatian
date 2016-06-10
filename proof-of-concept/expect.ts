import { MatchError} from "./match-error";

export function Expect(actualValue: any){
  return new Matcher(actualValue);
}

class Matcher {

  private _actualValue: any;
  private _shouldMatch: boolean = true;

  public get not(): Matcher {
    this._shouldMatch = !this._shouldMatch;
    return this;
  }

  public constructor(actualValue: any) {
    this._actualValue = actualValue;
  }

  public toBe(expectedValue: any) {
    if (expectedValue !== this._actualValue === this._shouldMatch) {
      throw new MatchError(this._actualValue, expectedValue, this._shouldMatch);
    }
  }
}
