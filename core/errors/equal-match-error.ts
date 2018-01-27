import { stringify } from "../stringification";
import { MatchError } from "./match-error";

export class EqualMatchError extends MatchError {
  public constructor(
    actualValue: any,
    expectedValue: any,
    shouldMatch: boolean
  ) {
    super();

    this.message =
      `Expected ${stringify(actualValue)} ${!shouldMatch ? "not " : ""}` +
      `to be equal to ${stringify(expectedValue)}.`;
    this._expected = expectedValue;
    this._actual = actualValue;
  }
}
