import { MatchError } from "./match-error";
import { INameable } from "../_interfaces";

export class ErrorMatchError extends MatchError {

   public constructor(actualError: Error,
                      shouldMatch: boolean,
                      expectedErrorType?: new (...args: Array<any>) => Error,
                      expectedErrorMessage?: string) {
      super();

      this._setErrorMessage(actualError, shouldMatch, expectedErrorType, expectedErrorMessage);

      this._actual = `${actualError ? (actualError.constructor as INameable).name + " " : ""}` +
                     `error was ${!actualError ? "not " : ""}thrown` +
                     `${actualError ? " with message \"" + actualError.message + "\"" : ""}.`;

      this._expected = `${expectedErrorType ? (expectedErrorType as INameable).name + " " : ""}` +
                       `error ${!shouldMatch ? "not " : ""}to be thrown` +
                       `${expectedErrorMessage ? " with message \"" + expectedErrorMessage + "\"" : ""}.`;
   }

   private _setErrorMessage(actualError: Error,
                            shouldMatch: boolean,
                            expectedErrorType?: new (...args: Array<any>) => Error,
                            expectedErrorMessage?: string) {

      if (expectedErrorType || expectedErrorMessage) {
         this._setWrongSpecificErrorMessage(actualError, shouldMatch, expectedErrorType, expectedErrorMessage);
      }
      else {
         if (shouldMatch) {
            this.message = `Expected an error to be thrown but no errors were thown.`;
         }
         else {
            this.message = `Expected an error not to be thrown but an error was thown.`;
         }
      }
   }

   private _setWrongSpecificErrorMessage(actualError: Error,
                                         shouldMatch: boolean,
                                         expectedErrorType?: new (...args: Array<any>) => Error,
                                         expectedErrorMessage?: string) {

      if (!expectedErrorType
          || (expectedErrorMessage &&
              actualError instanceof expectedErrorType &&
              expectedErrorMessage !== actualError.message)) {

         this._setWrongMessageMessage(shouldMatch, expectedErrorMessage);
      }
      else if (expectedErrorMessage === undefined ||
                (actualError &&
                 expectedErrorMessage === actualError.message &&
                 !(actualError instanceof expectedErrorType))) {

         this._setWrongTypeMessage(actualError, shouldMatch, expectedErrorType);
      }
      else {
         this._setWrongMessageAndTypeMessage(shouldMatch, expectedErrorType, expectedErrorMessage);
      }
   }

   private _setWrongMessageMessage(shouldMatch: boolean, expectedErrorMessage?: string) {
      this.message = `Expected an error with message "${expectedErrorMessage}" ` +
                     `to ${!shouldMatch ? "not " : ""}have been thrown, ` +
                     `but it was${!shouldMatch ? "" : "n't"}.`;
   }

   private _setWrongMessageAndTypeMessage(shouldMatch: boolean,
                                          expectedErrorType?: new (...args: Array<any>) => Error,
                                          expectedErrorMessage?: string) {

      this.message = `Expected an error with message "${expectedErrorMessage}" ` +
                     `and type ${(expectedErrorType as INameable).name} to ${!shouldMatch ? "not " : ""}` +
                     `have been thrown, but it was${!shouldMatch ? "" : "n't"}.`;
   }

   private _setWrongTypeMessage(actualError: Error,
                                shouldMatch: boolean,
                                expectedErrorType?: new (...args: Array<any>) => Error) {

      this.message = `Expected an error of type ${(expectedErrorType as INameable).name} ` +
                     `to ${!shouldMatch ? "not " : ""}have been thrown, ` +
                     `but ${shouldMatch ? (actualError as INameable).name + " was thrown instead" : "it was"}.`;
   }
}
