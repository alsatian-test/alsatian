import { MatchError } from "./match-error";
import { stringify } from "../stringification";

export class RegexMatchError extends MatchError {
  public constructor(
    actualValue: any,
    expectedRegex: RegExp,
    shouldMatch: boolean
  ) {
    super(
      `Expected ${stringify(actualValue)} ${
        !shouldMatch ? "not " : ""
      }to conform to ${expectedRegex}.`,
      expectedRegex,
      actualValue
    );
  }
}
