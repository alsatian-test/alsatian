import { Matcher } from "./matcher";

enum LimitType {
	LessThan,
	GreaterThan
}

/**
 * Compares numbers
 */
export class NumberMatcher extends Matcher<number> {
	/**
	 * Checks that a number is less than a given limit
	 * @param upperLimit - the number that the number under test should be less than
	 */
	public toBeLessThan(upperLimit: number) {
		this._matchAgainstLimit(upperLimit, LimitType.LessThan);
	}

	/**
	 * Checks that a number is greater than a given limit
	 * @param lowerLimit - the number that the number under test should be greater than
	 */
	public toBeGreaterThan(lowerLimit: number) {
		this._matchAgainstLimit(lowerLimit, LimitType.GreaterThan);
	}

	private _matchAgainstLimit(limit: number, limitType: LimitType) {
		const limitTypeName = LimitType[limitType];

		this._validateValues(
			limit,
			`toBe${LimitType[limitType]}`,
			`${limitType === LimitType.LessThan ? "upper" : "lower"} limit`
		);

		const readableLimitType = limitTypeName.replace(/(a-z)(A-Z)/, "$1 $2").toLowerCase();

		const exceedsLimit = limitType === LimitType.LessThan ? this.actualValue < limit: this.actualValue > limit;

		this._registerMatcher(
			exceedsLimit === this.shouldMatch,
			`Expected ${this.actualValue} ${
				!this.shouldMatch ? "not " : ""
			}to be ${readableLimitType} ${limit}.`,
			`a number ${
				!this.shouldMatch ? "not " : ""
			}${readableLimitType} ${limit}`,
			{
				actual: this.actualValue,
				limit
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
