import { GreaterThanMatchError, LessThanMatchError } from "../errors";
import { Matcher } from "./matcher";

/**
 * Compares numbers
 */
export class NumberMatcher extends Matcher<number> {
  /**
   * Checks that a number is less than a given limit
   * @param upperLimit - the number that the number under test should be less than
   */
  public toBeLessThan(upperLimit: number) {
    this._validateValues(upperLimit);

    if (this.actualValue < upperLimit !== this.shouldMatch) {
      throw new LessThanMatchError(
        this.actualValue,
        upperLimit,
        this.shouldMatch
      );
    }
  }

  /**
   * Checks that a number is greater than a given limit
   * @param lowerLimit - the number that the number under test should be greater than
   */
  public toBeGreaterThan(lowerLimit: number) {
    this._validateValues(lowerLimit);

    if (this.actualValue > lowerLimit !== this.shouldMatch) {
      throw new GreaterThanMatchError(
        this.actualValue,
        lowerLimit,
        this.shouldMatch
      );
    }
  }

  private _validateValues(limit: number) {
    if (limit === null || limit === undefined) {
      throw new TypeError(
        "toBeGreaterThan lower limit must not be null or undefined."
      );
    }

    if (typeof this.actualValue !== "number") {
      throw new TypeError("toBeGreaterThan can only check numbers.");
    }
  }
}
