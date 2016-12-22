import { MatchError } from "../_errors";

export class EqualMatchError extends MatchError {

  public constructor(actualValue: any, expectedValue: any, shouldMatch: boolean) {
    super(`Expected ${JSON.stringify(actualValue)} ${!shouldMatch ? "not " : ""}to be equal to ${JSON.stringify(expectedValue)}.`, expectedValue, actualValue);
  }
}
