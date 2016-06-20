import { MatchError } from "./match-error";

export class ErrorMatchError extends MatchError {

  public constructor(actualError: Error, shouldMatch: boolean, expectedErrorType?: new (...args: Array<any>) => Error, expectedErrorMessage?: string) {
    super(actualError, expectedErrorMessage, "");

    if (expectedErrorType || expectedErrorMessage) {
      if (expectedErrorType === undefined || expectedErrorType === null) {
         this._message = `Expected an error with message "${expectedErrorMessage}" to ${!shouldMatch ? "not " : ""}have been thrown, but it was${!shouldMatch ? "" : "n't"}.`;
      }
      else if (expectedErrorMessage === undefined) {
         this._message = `Expected an error of type ${(<any>expectedErrorType)["name"]} to ${!shouldMatch ? "not " : ""}have been thrown, but ${shouldMatch ? (<any>actualError)["name"] + " was thrown instead" : "it was"}.`;
      }
      else {
         this._message = `Expected an error with message "${expectedErrorMessage}" and type ${(<any>expectedErrorType)["name"]} to ${!shouldMatch ? "not " : ""}have been thrown, but it was${!shouldMatch ? "" : "n't"}.`;
      }
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
}
