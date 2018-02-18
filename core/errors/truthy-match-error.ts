import { MatchError } from "./match-error";
import { stringify } from "../stringification";

/**
 * Represents an error thrown in a failed
 * Matcher.toBeTruthy() or Matcher.toBeFalsy() statement.
 *
 * @export
 * @class TruthyMatchError
 * @extends {MatchError}
 */
export class TruthyMatchError extends MatchError {
  /**
   * Creates an instance of TruthyMatchError.
   * @param {*} actualValue The actual received value
   * @param {boolean} shouldMatch The expected boolean value
   * @memberof TruthyMatchError
   */
  public constructor(actualValue: any, shouldMatch: boolean) {
    super(
      `Expected ${stringify(actualValue)} ${
        !shouldMatch ? "not " : ""
      }to be truthy.`
    );

    this._actual = actualValue;
    this._expected = shouldMatch ? "truthy" : "falsy";
  }
}
