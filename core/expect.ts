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

/**
 * Allows checking of test outcomes
 * @param actualValue - the value or function under test
 */
export function Expect(actualValue: any) {
  return new Matcher(actualValue);
}

/**
 * Gives functionality to ensure the outcome of a test is as expected
 */
export class Matcher {

  private _actualValue: any;
  private _shouldMatch: boolean = true;

  public constructor(actualValue: any) {
    this._actualValue = actualValue;
  }

  /**
   * Any subsequent matcher function will be looking for the opposite criteria
   */
  public get not(): Matcher {
    this._shouldMatch = !this._shouldMatch;
    return this;
  }

  /**
   * Checks that a value is identical to another
   * @param expectedValue - the value that will be used to match
   */
  public toBe(expectedValue: any) {
    if (expectedValue !== this._actualValue === this._shouldMatch) {
      throw new ExactMatchError(this._actualValue, expectedValue, this._shouldMatch);
    }
  }

  /**
   * Checks that a value is equal to another (for objects the function will check for deep equality)
   * @param expectedValue - the value that will be used to match
   */
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

  /**
   * Checks that a value conforms to a regular expression
   * @param regex - the regular expression that the actual value should match
   */
  public toMatch(regex: RegExp) {
    if (!regex.test(this._actualValue) === this._shouldMatch) {
      throw new RegexMatchError(this._actualValue, regex, this._shouldMatch);
    }
  }

  /**
   * Checks that a value is not undefined
   */
  public toBeDefined() {
    if (this._actualValue === undefined === this._shouldMatch) {
      throw new ExactMatchError(this._actualValue, undefined, !this._shouldMatch);
    }
  }

  /**
   * Checks that a value is null
   */
  public toBeNull() {
    if (this._actualValue !== null === this._shouldMatch) {
      throw new ExactMatchError(this._actualValue, null, this._shouldMatch);
    }
  }

  /**
   * Checks that a value is equivalent to boolean true
   */
  public toBeTruthy() {
    if ((this._actualValue && !this._shouldMatch) || (!this._actualValue && this._shouldMatch)) {
      throw new TruthyMatchError(this._actualValue, this._shouldMatch);
    }
  }

  /**
   * Checks that a string contains another string or an array contains a specific item
   * @param expectedContent - the string or array item that the value should contain
   */
  public toContain(expectedContent: any) {
    if (this._actualValue.indexOf(expectedContent) === -1 === this._shouldMatch) {
      throw new ContentsMatchError(this._actualValue, expectedContent, this._shouldMatch);
    }
  }

  /**
   * Checks that a number is less than a given limit
   * @param upperLimit - the number that the number under test should be less than
   */
  public toBeLessThan(upperLimit: number) {
    if (this._actualValue < upperLimit !== this._shouldMatch) {
      throw new LessThanMatchError(this._actualValue, upperLimit, this._shouldMatch);
    }
  }

  /**
   * Checks that a number is greater than a given limit
   * @param lowerLimit - the number that the number under test should be greater than
   */
  public toBeGreaterThan(lowerLimit: number) {
    if (this._actualValue > lowerLimit !== this._shouldMatch) {
      throw new GreaterThanMatchError(this._actualValue, lowerLimit, this._shouldMatch);
    }
  }

  /**
   * Checks that a function throws an error when executed
   */
  public toThrow() {
    let threwError = false;
    let actualError: Error;

    try {
      this._actualValue();
    }
    catch (error) {
      actualError = error;
      threwError = true;
    }

    if (!threwError === this._shouldMatch) {
      throw new ErrorMatchError(actualError, this._shouldMatch);
    }
  }

  /**
   * Checks that a function throws a specific error
   * @param errorType - the type of error that should be thrown
   * @param errorMessage - the message that the error should have
   */
  public toThrowError(errorType: new (...args: Array<any>) => Error, errorMessage: string) {
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

  /**
   * Checks that a spy has been called
   */
  public toHaveBeenCalled() {
    if (this._actualValue.calls.length === 0 === this._shouldMatch) {
      throw new FunctionCallMatchError(this._actualValue, this._shouldMatch);
    }
  }

  /**
   * Checks that a spy has been called with the specified arguments
   * @param args - a list of arguments that the spy should have been called with
   */
  public toHaveBeenCalledWith(...args: Array<any>) {
    if (this._actualValue.calls.filter((call: any) => call.args.filter((arg: any, index: number) => arg === args[index]) && call.args.length === args.length).length === 0 === this._shouldMatch) {
      throw new FunctionCallMatchError(this._actualValue, this._shouldMatch, args);
    }
  }
}
