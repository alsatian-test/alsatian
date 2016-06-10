import { MatchError} from "./match-error";

export function Expect(actualValue: any){
  return new Matcher(actualValue);
}

class Matcher {

  private _actualValue: any;

  public constructor(actualValue: any) {
    this._actualValue = actualValue;
  }

  public toBe(expectedValue: any) {
    if (expectedValue !== this._actualValue) {
      throw new MatchError(this._actualValue, expectedValue);
    }
  }
}
