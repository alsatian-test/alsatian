import { MatchError } from "../_errors";

export class RegexMatchError extends MatchError {

  public constructor(actualValue: any, expectedRegex: RegExp, shouldMatch: boolean) {
    super(actualValue, expectedRegex, `Expected ${JSON.stringify(actualValue)} ${!shouldMatch ? "not ": ""}to conform to ${expectedRegex}.`);
  }
}
