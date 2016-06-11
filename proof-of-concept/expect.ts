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

  public toEqual(expectedValue: any) {
    if (expectedValue != this._actualValue === this._shouldMatch) {
      throw new MatchError(this._actualValue, expectedValue, this._shouldMatch);
    }
  }

  public toMatch(regex: any) {
    if (!regex.test(this._actualValue) === this._shouldMatch) {
      throw new MatchError(this._actualValue, regex, this._shouldMatch);
    }
  }

  public toBeDefined() {
    if (this._actualValue === undefined === this._shouldMatch) {
      throw new MatchError(this._actualValue, undefined, this._shouldMatch);
    }
  }

  public toBeNull() {
    if (this._actualValue !== null === this._shouldMatch) {
      throw new MatchError(this._actualValue, null, this._shouldMatch);
    }
  }

  public toBeTruthy() {
    if ((this._actualValue && !this._shouldMatch) || (!this._actualValue && this._shouldMatch)) {
      throw new MatchError(this._actualValue, "truthy", this._shouldMatch);
    }
  }

  public toContain(expectedContent: any) {
    if (this._actualValue.indexOf(expectedContent) === -1 === this._shouldMatch) {
      throw new MatchError(this._actualValue, expectedContent, this._shouldMatch);
    }
  }

  public toBeLessThan(upperLimit: any) {
    if (this._actualValue > upperLimit === this._shouldMatch) {
      throw new MatchError(this._actualValue, upperLimit, this._shouldMatch);
    }
  }

  public toBeGreaterThan(lowerLimit: any) {
    if (this._actualValue < lowerLimit === this._shouldMatch) {
      throw new MatchError(this._actualValue, lowerLimit, this._shouldMatch);
    }
  }

  public toThrow() {
    let threwError = false;
    try {
      this._actualValue();
    }
    catch(error) {
      threwError = true;
    }

    if (!threwError === this._shouldMatch) {
      throw new MatchError(this._actualValue, "throw error", this._shouldMatch);
    }
  }

  public toThrowError(errorType: (...args: Array<any>) => Error, errorMessage: string) {
    let threwRightError = false;
    try {
      this._actualValue();
    }
    catch(error) {
      if (error instanceof errorType && error.message === errorMessage) {
        threwRightError = true;
      }
    }

    if (!threwRightError === this._shouldMatch) {
      throw new MatchError(this._actualValue, "throw right error", this._shouldMatch);
    }
  }
}
