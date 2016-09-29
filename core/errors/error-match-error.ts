import { MatchError } from "../_errors";

export class ErrorMatchError extends MatchError {

   public constructor(actualError: Error, shouldMatch: boolean, expectedErrorType?: new (...args: Array<any>) => Error, expectedErrorMessage?: string) {
      super(`${actualError ? (<any>actualError.constructor).name + " " : ""}error was ${!actualError ? "not " : ""}thrown${actualError ? " with message \"" + actualError.message + "\"" : ""}.`,
            `${expectedErrorType ? (<any>expectedErrorType).name + " " : ""}error ${!shouldMatch ? "not " : ""}to be thrown${expectedErrorMessage ? " with message \"" + expectedErrorMessage + "\"" : ""}.`,
            "");

      this._setErrorMessage(actualError, shouldMatch, expectedErrorType, expectedErrorMessage);
   }

   private _setErrorMessage(actualError: Error, shouldMatch: boolean, expectedErrorType?: new (...args: Array<any>) => Error, expectedErrorMessage?: string) {        

      if (expectedErrorType || expectedErrorMessage) {
         this._setWrongSpecificErrorMessage(actualError, shouldMatch, expectedErrorType, expectedErrorMessage);
      }
      else {
         if (shouldMatch) {
            this._message = `Expected an error to be thrown but no errors were thown.`;
         }
         else {
            this._message = `Expected an error not to be thrown but an error was thown.`;
         }
      }
   }

   private _setWrongSpecificErrorMessage(actualError: Error, shouldMatch: boolean, expectedErrorType?: new (...args: Array<any>) => Error, expectedErrorMessage?: string) {
      if (!expectedErrorType || (expectedErrorMessage && actualError instanceof expectedErrorType && expectedErrorMessage !== actualError.message)) {
         this._setWrongMessageMessage(shouldMatch, expectedErrorMessage);
      }
      else if (expectedErrorMessage === undefined || (actualError && expectedErrorMessage === actualError.message && !(actualError instanceof expectedErrorType))) {
         this._setWrongTypeMessage(actualError, shouldMatch, expectedErrorType);
      }
      else {
         this._setWrongMessageAndTypeMessage(shouldMatch, expectedErrorType, expectedErrorMessage);
      }
   }

   private _setWrongMessageMessage(shouldMatch: boolean, expectedErrorMessage?: string) {
      this._message = `Expected an error with message "${expectedErrorMessage}" to ${!shouldMatch ? "not " : ""}have been thrown, but it was${!shouldMatch ? "" : "n't"}.`;
   }

   private _setWrongMessageAndTypeMessage(shouldMatch: boolean, expectedErrorType?: new (...args: Array<any>) => Error, expectedErrorMessage?: string) {
      this._message = `Expected an error with message "${expectedErrorMessage}" and type ${(<any>expectedErrorType)["name"]} to ${!shouldMatch ? "not " : ""}have been thrown, but it was${!shouldMatch ? "" : "n't"}.`;
   }

   private _setWrongTypeMessage(actualError: Error, shouldMatch: boolean, expectedErrorType?: new (...args: Array<any>) => Error) {
      this._message = `Expected an error of type ${(<any>expectedErrorType)["name"]} to ${!shouldMatch ? "not " : ""}have been thrown, but ${shouldMatch ? (<any>actualError)["name"] + " was thrown instead" : "it was"}.`;
   }
}
