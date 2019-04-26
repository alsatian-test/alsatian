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

		this._registerMatcher(
			this.actualValue < upperLimit !== this.shouldMatch,
			`Expected ${this.actualValue} ${
				!this.shouldMatch ? "not " : ""
			}to be less than ${upperLimit}.`,
			upperLimit,
			{
				actual: this.actualValue,
				upperLimit
			}
		);
	}

	/**
	 * Checks that a number is greater than a given limit
	 * @param lowerLimit - the number that the number under test should be greater than
	 */
	public toBeGreaterThan(lowerLimit: number) {
		this._validateValues(lowerLimit, "toBeGreaterThan", "lower limit");

		this._registerMatcher(
			this.actualValue > lowerLimit !== this.shouldMatch,
			`Expected ${this.actualValue} ${
				!this.shouldMatch ? "not " : ""
			}to be greater than ${lowerLimit}.`,
			lowerLimit,
			{
				actual: this.actualValue,
				lowerLimit
			}
		);
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
	}
}
