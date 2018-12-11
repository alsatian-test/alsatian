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
		this._validateValues(upperLimit, "toBeLessThan", "upper limit");

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
		this._validateValues(lowerLimit, "toBeGreaterThan", "lower limit");

		if (this.actualValue > lowerLimit !== this.shouldMatch) {
			throw new GreaterThanMatchError(
				this.actualValue,
				lowerLimit,
				this.shouldMatch
			);
		}
	}

	private _validateValues(
		limit: number,
		functionName: string,
		limitType: string
	) {
		if (limit === null || limit === undefined) {
			throw new TypeError(
				`${functionName} ${limitType} must not be null or undefined.`
			);
		}

		if (typeof this.actualValue !== "number") {
			throw new TypeError(`${functionName} can only check numbers.`);
		}
	}
}
