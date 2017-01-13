import { MatchError } from "../errors";
import { ArgumentStringifier } from "../stringification";

export class EqualMatchError extends MatchError {

  private _argumentStringifier = new ArgumentStringifier();

  public constructor(actualValue: any, expectedValue: any, shouldMatch: boolean) {
    super();

    this.message = `Expected ${this._argumentStringifier.stringify(actualValue)} ${!shouldMatch ? "not " : ""}` +
                   `to be equal to ${this._argumentStringifier.stringify(expectedValue)}.`;
    this._expected = expectedValue;
    this._actual = actualValue;
  }
}
