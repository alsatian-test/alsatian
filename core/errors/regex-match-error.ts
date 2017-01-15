import { MatchError } from "./match-error";

export class RegexMatchError extends MatchError {

  public constructor(actualValue: any, expectedRegex: RegExp, shouldMatch: boolean) {
    super(`Expected ${JSON.stringify(actualValue)} ${!shouldMatch ? "not " : ""}to conform to ${expectedRegex}.`,
          expectedRegex,
          actualValue);
  }
}
