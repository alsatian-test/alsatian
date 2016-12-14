import { MatchError } from "../errors";

export class ExactMatchError extends MatchError {

  public constructor(actualValue: any, expectedValue: any, shouldMatch: boolean) {
    super(actualValue, expectedValue, `Expected ${JSON.stringify(actualValue)} ${!shouldMatch ? "not " : ""}to be ${JSON.stringify(expectedValue)}.`);
  }
}
