import { MatchError } from "../errors";
import { stringify } from "../stringification";
import { diff } from "./diff";
import { TypeMatcher } from "../spying";

/**
 * Gives functionality to ensure the outcome of a test is as expected
 */
export class Matcher<T> {
	/**
	 * Any subsequent matcher function will be looking for the opposite criteria
	 */
	public get not(): this {
		this.shouldMatch = !this.shouldMatch;
		return this;
	}

	protected readonly actualValue: T;

	protected shouldMatch: boolean = true;

	public constructor(actualValue: T) {
		this.actualValue = actualValue;
	}

	/**
	 * Checks that a value is identical to another
	 * @param expectedValue - the value that will be used to match
	 */
	public toBe(expectedValue: T) {
		this._registerMatcher(
			(expectedValue === this.actualValue) === this.shouldMatch,
			`Expected ${stringify(this.actualValue)} ${
				!this.shouldMatch ? "not " : ""
			}` + `to be ${stringify(expectedValue)}.`,
			expectedValue
		);
	}

	/**
	 * Checks that a value is equal to another (for objects the function will check for deep equality)
	 * @param expectedValue - the value that will be used to match
	 */
	public toEqual(expectedValue: any) {
		this._checkTypeMatcherEqual(expectedValue, this.toEqualCheck);
	}

	/**
	 * Checks that a value is not undefined
	 */
	public toBeDefined() {
		this._registerMatcher(
			(this.actualValue !== undefined) === this.shouldMatch,
			`Expected ${stringify(this.actualValue)} ${
				this.shouldMatch ? "not " : ""
			}` + `to be undefined.`,
			undefined
		);
	}

	/**
	 * Checks that a value is null
	 */
	public toBeNull() {
		this._registerMatcher(
			(this.actualValue === null) === this.shouldMatch,
			`Expected ${stringify(this.actualValue)} ${
				!this.shouldMatch ? "not " : ""
			}` + `to be null.`,
			null
		);
	}

	/**
	 * Checks that a value is equivalent to boolean true
	 */
	public toBeTruthy() {
		this._registerMatcher(
			(this.actualValue && this.shouldMatch) ||
				(!this.actualValue && !this.shouldMatch),
			`Expected ${stringify(this.actualValue)} ${
				!this.shouldMatch ? "not " : ""
			}to be truthy.`,
			this.shouldMatch ? "truthy" : "falsy"
		);
	}

	protected _registerMatcher(
		isMatch: boolean,
		failureMessage: string,
		expectedValue: any,
		extras?: { [prop: string]: any }
	) {
		if (isMatch === false) {
			throw new MatchError(
				failureMessage,
				expectedValue,
				this.actualValue,
				extras
			);
		}
	}

	protected _checkTypeMatcherEqual(expected: any, alternativeCheck: (expectedValue: T) => void) {
		if (expected instanceof TypeMatcher) {
			this._registerMatcher(
				expected.test(this.actualValue) === this.shouldMatch,
				`Expected values ${!this.shouldMatch ? "not " : ""}to be equal`,
				expected,
				{
					diff: diff(expected, this.actualValue)
				}
			);
		}
		else {
			alternativeCheck.call(this, expected);
		}
	}

	private toEqualCheck(expectedValue: any) {
		this._registerMatcher(
			// exclude the double equals in this case from review
			// as this is what we want to do
			// tslint:disable-next-line:triple-equals
			(expectedValue == this.actualValue) === this.shouldMatch,
			`Expected values ${!this.shouldMatch ? "not " : ""}to be equal`,
			expectedValue,
			{
				diff: diff(expectedValue, this.actualValue)
			}
		);
	}
}
