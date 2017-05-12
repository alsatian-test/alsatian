import { FunctionSpyMatcher, Matcher } from "./";
import { ErrorMatchError, FunctionCallMatchError } from "../errors";
import { Any, FunctionSpy, TypeMatcher } from "../spying";

export class FunctionMatcher extends Matcher<FunctionSpy | any> {    

   /**
    * Checks that a function throws an error when executed
    */
   public toThrow() {

      if (this.actualValue instanceof Function === false) {
         throw new TypeError("toThrow requires value passed in to Expect to be a function.");
      }

      let errorThrown: Error;

      try {
         this.actualValue();
      }
      catch (error) {
         errorThrown = error;
      }

      if (errorThrown === undefined === this.shouldMatch) {
         throw new ErrorMatchError(errorThrown, this.shouldMatch);
      }
   }

   public async toThrowAsync() {

       if (this.actualValue instanceof Function === false) {
          throw new TypeError("toThrowAsync requires value passed in to Expect to be a function.");
       }

       let errorThrown: Error;

       try {
          await this.actualValue();
       }
       catch (error) {
          errorThrown = error;
       }

       if (errorThrown === undefined === this.shouldMatch) {
          throw new ErrorMatchError(errorThrown, this.shouldMatch);
       }
   }

   /**
    * Checks that a function throws a specific error
    * @param errorType - the type of error that should be thrown
    * @param errorMessage - the message that the error should have
    */
   public toThrowError(errorType: new (...args: Array<any>) => Error, errorMessage: string) {

      if (this.actualValue instanceof Function === false) {
         throw new TypeError("toThrowError requires value passed in to Expect to be a function.");
      }

      let threwRightError = false;
      let actualError: Error;

      try {
         this.actualValue();
      }
      catch (error) {
         actualError = error;

         if (error instanceof errorType && error.message === errorMessage) {
            threwRightError = true;
         }
      }

      if (threwRightError !== this.shouldMatch) {
         throw new ErrorMatchError(actualError, this.shouldMatch, (<any> errorType), errorMessage);
      }
   }

   /**
    * Checks that a function throws a specific error asynchronously
    * @param errorType - the type of error that should be thrown
    * @param errorMessage - the message that the error should have
    */
   public async toThrowErrorAsync(errorType: new (...args: Array<any>) => Error, errorMessage: string) {

       if (this.actualValue instanceof Function === false) {
          throw new TypeError("toThrowErrorAsync requires value passed to Expect to be a function.");
       }

       let threwRightError = false;
       let actualError: Error;

       try {
          await this.actualValue();
       }
       catch (error) {
          actualError = error;

          if (error instanceof errorType && error.message === errorMessage) {
             threwRightError = true;
          }
       }

       if (threwRightError !== this.shouldMatch) {
          throw new ErrorMatchError(actualError, this.shouldMatch, (<any> errorType), errorMessage);
       }
   }

   /**
    * Checks that a spy has been called
    */
   public toHaveBeenCalled(): FunctionSpyMatcher {
      if (this._isFunctionSpyOrSpiedOnFunction(this.actualValue) === false) {
         throw new TypeError(
             "toHaveBeenCalled requires value passed in to Expect to be a FunctionSpy or a spied on function."
         );
      }

      if (this.actualValue.calls.length === 0 === this.shouldMatch) {
         throw new FunctionCallMatchError(this.actualValue, this.shouldMatch);
      }

      return new FunctionSpyMatcher(this.actualValue);
   }

   protected _isFunctionSpyOrSpiedOnFunction(value: any) {
      return value instanceof FunctionSpy || (value instanceof Function && value.calls !== undefined);
   }
}