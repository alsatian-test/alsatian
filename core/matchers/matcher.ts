import { EqualMatchError, ExactMatchError, TruthyMatchError } from "../errors";
import { Any, TypeMatcher } from "../spying";

/**
 * Gives functionality to ensure the outcome of a test is as expected
 */
export class Matcher<T> {
  private _actualValue: T;
  protected get actualValue(): T {
    return this._actualValue;
  }

  private _shouldMatch: boolean = true;
  protected get shouldMatch(): boolean {
    return this._shouldMatch;
  }

  public constructor(actualValue: T) {
    this._actualValue = actualValue;
  }

  /**
   * Any subsequent matcher function will be looking for the opposite criteria
   */
  public get not(): this {
    this._shouldMatch = !this.shouldMatch;
    return this;
  }

  /**
   * Checks that a value is identical to another
   * @param expectedValue - the value that will be used to match
   */
  public toBe(expectedValue: T) {
    if ((expectedValue !== this._actualValue) === this.shouldMatch) {
      throw new ExactMatchError(
        this._actualValue,
        expectedValue,
        this.shouldMatch
      );
    }
  }

  /**
   * Checks that a value is equal to another (for objects the function will check for deep equality)
   * @param expectedValue - the value that will be used to match
   */
  public toEqual(expectedValue: any) {
    let valueMatch: boolean;

    if (expectedValue instanceof TypeMatcher) {
      valueMatch = expectedValue.test(this._actualValue);
    } else if (expectedValue instanceof Object) {
      valueMatch = this._checkObjectsAreDeepEqual(
        expectedValue,
        this._actualValue
      );
    } else {
      // exclude the double equals in this case from review
      // as this is what we want to do
      // tslint:disable-next-line:triple-equals
      valueMatch = expectedValue == this._actualValue;
    }

    if (valueMatch !== this.shouldMatch) {
      throw new EqualMatchError(
        this._actualValue,
        expectedValue,
        this.shouldMatch
      );
    }
  }

  /**
   * Checks that a value is not undefined
   */
  public toBeDefined() {
    if ((this._actualValue === undefined) === this.shouldMatch) {
      throw new ExactMatchError(
        this._actualValue,
        undefined,
        !this.shouldMatch
      );
    }
  }

  /**
   * Checks that a value is null
   */
  public toBeNull() {
    if ((this._actualValue !== null) === this.shouldMatch) {
      throw new ExactMatchError(this._actualValue, null, this.shouldMatch);
    }
  }

  /**
   * Checks that a value is equivalent to boolean true
   */
  public toBeTruthy() {
    if (
      (this._actualValue && !this.shouldMatch) ||
      (!this._actualValue && this.shouldMatch)
    ) {
      throw new TruthyMatchError(this._actualValue, this.shouldMatch);
    }
  }

  private _checkObjectsAreDeepEqual(objectA: any, objectB: any): boolean {
    // if one object is an array and the other is not then they are not equal
    if (Array.isArray(objectA) !== Array.isArray(objectB)) {
      return false;
    }

    // get all the property keys for each object
    const OBJECT_A_KEYS = Object.keys(objectA);
    const OBJECT_B_KEYS = Object.keys(objectB);

    // if they don't have the same amount of properties then clearly not
    if (OBJECT_A_KEYS.length !== OBJECT_B_KEYS.length) {
      return false;
    }

    // check all the properties of each object
    for (const objectAKey of OBJECT_A_KEYS) {
      // if the property values are not the same
      if (objectA[objectAKey] !== objectB[objectAKey]) {
        // and it's not an object or the objects are not equal
        if (
          typeof objectA[objectAKey] !== "object" ||
          this._checkObjectsAreDeepEqual(
            objectA[objectAKey],
            objectB[objectAKey]
          ) === false
        ) {
          // then not deep equal
          return false;
        }
      }
    }

    // all properties match so all is good
    return true;
  }
}
