import { stringify } from "../stringification";
import { MatchError } from "./match-error";

export class ContentsMatchError extends MatchError {
  public constructor(
    actualValue: any,
    expectedContent: any,
    shouldMatch: boolean
  ) {
    super(
      `Expected ${stringify(actualValue)} ${!shouldMatch ? "not " : ""}` +
      `to contain ${stringify(expectedContent)}.`,
      expectedContent,
      actualValue
    );
  }
}
