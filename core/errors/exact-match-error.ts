import { MatchError } from "../errors";
import { ArgumentStringifier } from "../stringification";

export class ExactMatchError extends MatchError {

  private _argumentStringifier = new ArgumentStringifier();

  public constructor(actualValue: any, expectedValue: any, shouldMatch: boolean) {
    super();

    this.message = `Expected ${JSON.stringify(actualValue)} ${!shouldMatch ? "not " : ""}` +
                   `to be ${this._argumentStringifier.stringify(expectedValue)}.`;

    this._expected = expectedValue;
    this._actual = actualValue;
  }
}
