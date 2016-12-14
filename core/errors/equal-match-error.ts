import { MatchError } from "../errors";

export class EqualMatchError extends MatchError {

  public constructor(actualValue: any, expectedValue: any, shouldMatch: boolean) {
    super(actualValue, expectedValue, `Expected ${JSON.stringify(actualValue)} ${!shouldMatch ? "not " : ""}to be equal to ${JSON.stringify(expectedValue)}.`);
  }
}
