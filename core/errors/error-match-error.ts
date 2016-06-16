import { MatchError } from "./match-error";

export class ErrorMatchError extends MatchError {

  //public constructor(actualError: Error, shouldMatch: boolean);
  public constructor(actualError: Error, shouldMatch: boolean, expectedErrorType?: new (...args: Array<any>) => Error, expectedErrorMessage?: string) {
    super(actualError, expectedErrorMessage, "");

    if (!actualError === shouldMatch) {
      if (shouldMatch) {
        this._message = `Expected an error to be thrown but no errors were thown.`;
      }
      else {
        this._message = `Expected an error not to be thrown but an error was thown.`;
      }
    }
    else if (actualError instanceof expectedErrorType !== shouldMatch) {
      this._message = `Expected an error of type ${expectedErrorType["name"]} to ${!shouldMatch ? "not ": ""}have been thrown, but it was${!shouldMatch ? "": "n't"}.`;
    }
    else if (actualError.message === expectedErrorMessage !== shouldMatch) {
      this._message = `Expected an error with message "${expectedErrorMessage}" to ${!shouldMatch ? "not ": ""}have been thrown, but it was${!shouldMatch ? "": "n't"}.`;
    }
    else {
      this._message = `Expected an error with message "${expectedErrorMessage}" and type ${expectedErrorType["name"]} to ${!shouldMatch ? "not ": ""}have been thrown, but it was${!shouldMatch ? "": "n't"}.`;
    }
  }
}
