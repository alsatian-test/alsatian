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
   FunctionCallMatchError,
   PropertySetMatchError
} from "./_errors";

import {
   FunctionSpy,
   PropertySpy,
   Any,
   TypeMatcher,
} from "./_spying";

import {
   FunctionSpyMatcher
} from "./matchers";

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
      // exclude the double equals in this case from review as this is what we want to do
      if (expectedValue != this._actualValue === this._shouldMatch) { // tslint:disable-line:triple-equals

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
      if (regex === null || regex === undefined) {
         throw new TypeError("toMatch regular expression must not be null or undefined.");
      }

      if (typeof this._actualValue !== "string") {
         throw new TypeError("toMatch must only be used to match on strings.");
      }

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

      if (this._actualValue instanceof Array === false && typeof this._actualValue !== "string") {
         throw new TypeError("toContain must only be used to check whether strings or arrays contain given contents.");
      }

      if (typeof this._actualValue === "string" && typeof expectedContent !== "string") {
         throw new TypeError("toContain cannot check whether a string contains a non string value.");
      }

      if (this._actualValue.indexOf(expectedContent) === -1 === this._shouldMatch) {
         throw new ContentsMatchError(this._actualValue, expectedContent, this._shouldMatch);
      }
   }

   /**
   * Checks that a number is less than a given limit
   * @param upperLimit - the number that the number under test should be less than
   */
   public toBeLessThan(upperLimit: number) {
      if (upperLimit === null || upperLimit === undefined) {
         throw new TypeError("toBeLessThan upper limit must not be null or undefined.");
      }

      if (typeof this._actualValue !== "number") {
         throw new TypeError("toBeLessThan can only check numbers.");
      }

      if (this._actualValue < upperLimit !== this._shouldMatch) {
         throw new LessThanMatchError(this._actualValue, upperLimit, this._shouldMatch);
      }
   }

   /**
   * Checks that a number is greater than a given limit
   * @param lowerLimit - the number that the number under test should be greater than
   */
   public toBeGreaterThan(lowerLimit: number) {
      if (lowerLimit === null || lowerLimit === undefined) {
         throw new TypeError("toBeGreaterThan lower limit must not be null or undefined.");
      }

      if (typeof this._actualValue !== "number") {
         throw new TypeError("toBeGreaterThan can only check numbers.");
      }

      if (this._actualValue > lowerLimit !== this._shouldMatch) {
         throw new GreaterThanMatchError(this._actualValue, lowerLimit, this._shouldMatch);
      }
   }

   /**
   * Checks that a function throws an error when executed
   */
   public toThrow() {

      if (this._actualValue instanceof Function === false) {
         throw new TypeError("toThrow requires value passed in to Expect to be a function.");
      }

      let errorThrown: Error;

      try {
         this._actualValue();
      }
      catch (error) {
         errorThrown = error;
      }

      if (errorThrown === undefined === this._shouldMatch) {
         throw new ErrorMatchError(errorThrown, this._shouldMatch);
      }
   }

   /**
   * Checks that a function throws a specific error
   * @param errorType - the type of error that should be thrown
   * @param errorMessage - the message that the error should have
   */
   public toThrowError(errorType: new (...args: Array<any>) => Error, errorMessage: string) {

      if (this._actualValue instanceof Function === false) {
         throw new TypeError("toThrowError requires value passed in to Expect to be a function.");
      }

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

      if (threwRightError !== this._shouldMatch) {
         throw new ErrorMatchError(actualError, this._shouldMatch, (<any>errorType), errorMessage);
      }
   }

   /**
   * Checks that a spy has been called
   */
   public toHaveBeenCalled(): FunctionSpyMatcher {
      if (this._isFunctionSpyOrSpiedOnFunction(this._actualValue) === false) {
         throw new TypeError("toHaveBeenCalled requires value passed in to Expect to be a FunctionSpy or a spied on function.");
      }

      if (this._actualValue.calls.length === 0 === this._shouldMatch) {
         throw new FunctionCallMatchError(this._actualValue, this._shouldMatch);
      }

      return new FunctionSpyMatcher(this._actualValue);
   }

   /**
   * Checks that a spy has been called with the specified arguments
   * @param expectedArguments - a list of arguments that the spy should have been called with
   */
   public toHaveBeenCalledWith(...expectedArguments: Array<any>): FunctionSpyMatcher {
      if (this._isFunctionSpyOrSpiedOnFunction(this._actualValue) === false) {
         throw new TypeError("toHaveBeenCalledWith requires value passed in to Expect to be a FunctionSpy or a spied on function.");
      }

      if (this._actualValue.calls.filter((call: any) => {
         return call.args.length === expectedArguments.length && // the call has the same amount of arguments
         call.args.filter((arg: any, index: number) => {
            const expectedArgument = expectedArguments[index];
            return arg === expectedArgument ||
                   expectedArgument === Any ||
                  (expectedArgument instanceof TypeMatcher && expectedArgument.test(arg));
         }).length === expectedArguments.length; // and all call arguments match expected arguments
      }).length === 0 === this._shouldMatch) {
         throw new FunctionCallMatchError(this._actualValue, this._shouldMatch, expectedArguments);
      }

      return new FunctionSpyMatcher(this._actualValue, expectedArguments);
   }

   private _isFunctionSpyOrSpiedOnFunction(value: any) {
      return value instanceof FunctionSpy || (value instanceof Function && value.calls !== undefined);
   }

   /**
   * Checks that a property spy has been set
   */
   public toHaveBeenSet() {
      if (this._actualValue instanceof PropertySpy === false) {
         throw new TypeError("toHaveBeenSet requires value passed in to Expect to be a PropertySpy.");
      }

      if (this._actualValue.setCalls.length === 0 === this._shouldMatch) {
         throw new PropertySetMatchError(this._actualValue, this._shouldMatch);
      }
   }

   /**
   * Checks that a property spy has been set to a specific value
   * @param value - a value to which the property should be set to
   */
   public toHaveBeenSetTo(value: any) {
      if (this._actualValue instanceof PropertySpy === false) {
         throw new TypeError("toHaveBeenSetTo requires value passed in to Expect to be a PropertySpy.");
      }

      if (this._actualValue.setCalls.filter((call: any) => call.args[0] === value).length === 0 === this._shouldMatch) {
         throw new PropertySetMatchError(this._actualValue, this._shouldMatch, value);
      }
   }
}
