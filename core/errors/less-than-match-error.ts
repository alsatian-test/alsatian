import { MatchError } from "./match-error";

export class LessThanMatchError extends MatchError {
  public constructor(
    actualValue: number,
    upperLimit: number,
    shouldMatch: boolean
  ) {
    super(
      `Expected ${actualValue} ${
        !shouldMatch ? "not " : ""
      }to be less than ${upperLimit}.`
    );

    this._actual = actualValue;
    this._expected = `a number ${
      shouldMatch ? "" : "not "
    }less than ${upperLimit}`;
  }
}
