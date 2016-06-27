import {
    MatchError,
    ExactMatchError,
    EqualMatchError,
    RegexMatchError,
    TruthyMatchError,
    ContentsMatchError,
    LessThanMatchError,
    GreaterThanMatchError,
    ErrorMatchError,
    FunctionCallMatchError
} from "./errors/_namespace";

export function Expect(actualValue: any){
  return new Matcher(actualValue);
}

export class Matcher {

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
      throw new ExactMatchError(this._actualValue, expectedValue, this._shouldMatch);
    }
  }

  public toEqual(expectedValue: any) {
    if (expectedValue != this._actualValue === this._shouldMatch) {

      if (typeof expectedValue !== "object" || this._checkObjectsAreDeepEqual(expectedValue, this._actualValue) !== this._shouldMatch) {
         throw new EqualMatchError(this._actualValue, expectedValue, this._shouldMatch);
      }
    }
  }

  private _checkObjectsAreDeepEqual(objectA: any, objectB: any): boolean {

     // if one object is an array and the other is not then they are not equal
     if (Array.isArray(objectA) !== Array.isArray(objectB)) {
        return false;
     }

     // get all the property keys for each object
     let objectAKeys = Object.keys(objectA);
     let objectBKeys = Object.keys(objectB);

     // if they don't have the same amount of properties then clearly not
     if (objectAKeys.length !== objectBKeys.length) {
        return false;
     }

     // check all the properties of each object
     for (let i = 0; i < objectAKeys.length; i++) {
        let objectAKey = objectAKeys[i];

        // if the property values are not the same
        if (objectA[objectAKey] !== objectB[objectAKey]) {

           // and it's not an object or the objects are not equal
           if (typeof(objectA[objectAKey]) !== "object" || this._checkObjectsAreDeepEqual(objectA[objectAKey], objectB[objectAKey]) === false) {
             // then not deep equal
             return false;
          }
        }
     }

     // all properties match so all is good
     return true;
  }

  public toMatch(regex: any) {
    if (!regex.test(this._actualValue) === this._shouldMatch) {
      throw new RegexMatchError(this._actualValue, regex, this._shouldMatch);
    }
  }

  public toBeDefined() {
    if (this._actualValue === undefined === this._shouldMatch) {
      throw new ExactMatchError(this._actualValue, undefined, !this._shouldMatch);
    }
  }

  public toBeNull() {
    if (this._actualValue !== null === this._shouldMatch) {
      throw new ExactMatchError(this._actualValue, null, this._shouldMatch);
    }
  }

  public toBeTruthy() {
    if ((this._actualValue && !this._shouldMatch) || (!this._actualValue && this._shouldMatch)) {
      throw new TruthyMatchError(this._actualValue, this._shouldMatch);
    }
  }

  public toContain(expectedContent: any) {
    if (this._actualValue.indexOf(expectedContent) === -1 === this._shouldMatch) {
      throw new ContentsMatchError(this._actualValue, expectedContent, this._shouldMatch);
    }
  }

  public toBeLessThan(upperLimit: any) {
    if (this._actualValue < upperLimit !== this._shouldMatch) {
      throw new LessThanMatchError(this._actualValue, upperLimit, this._shouldMatch);
    }
  }

  public toBeGreaterThan(lowerLimit: any) {
    if (this._actualValue > lowerLimit !== this._shouldMatch) {
      throw new GreaterThanMatchError(this._actualValue, lowerLimit, this._shouldMatch);
    }
  }

  public toThrow() {
    let threwError = false;
    let actualError: Error;

    try {
      this._actualValue();
    }
    catch(error) {
      actualError = error;
      threwError = true;
    }

    if (!threwError === this._shouldMatch) {
      throw new ErrorMatchError(actualError, this._shouldMatch);
    }
  }

  public toThrowError(errorType: (...args: Array<any>) => Error, errorMessage: string) {
    let threwRightError = false;
    let actualError: Error;

    try {
      this._actualValue();
    }
    catch (error) {
      actualError = error;

      if (error instanceof errorType && error.message === errorMessage) {
        threwRightError = true;
      }
    }

    if (!threwRightError === this._shouldMatch) {
      throw new ErrorMatchError(actualError, this._shouldMatch, (<any>errorType), errorMessage);
    }
  }

  public toHaveBeenCalled() {
    if (this._actualValue.calls.length === 0 === this._shouldMatch) {
      throw new FunctionCallMatchError(this._actualValue, this._shouldMatch);
    }
  }

  public toHaveBeenCalledWith(...args: Array<any>) {
    if (this._actualValue.calls.filter((call: any) => call.args.filter((arg: any, index: number) => arg === args[index]) && call.args.length === args.length).length === 0 === this._shouldMatch) {
      throw new FunctionCallMatchError(this._actualValue, this._shouldMatch, args);
    }
  }
}
