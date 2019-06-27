import { EmptyMatcher } from "./empty-matcher";
import { stringify } from "../stringification";

/**
 * Compares strings
 */
export class StringMatcher extends EmptyMatcher<string> {
	/**
	 * Checks that a value conforms to a regular expression
	 * @param regex - the regular expression that the actual value should match
	 */
	public toMatch(regex: RegExp) {
		if (regex === null || regex === undefined) {
			throw new TypeError(
				"toMatch regular expression must not be null or undefined."
			);
		}

		this._registerMatcher(
			regex.test(this.actualValue) === this.shouldMatch,
			`Expected ${stringify(this.actualValue)} ${
				!this.shouldMatch ? "not " : ""
			}to conform to ${regex}.`,
			regex,
			{
				string: this.actualValue,
				regex: regex.toString()
			}
		);
	}

	/**
	 * Checks that a string contains another string
	 * @param expectedContent - the string that should be found within
	 */
	public toContain(expectedContent: string) {
		this._registerMatcher(
			this.actualValue.indexOf(expectedContent) > -1 === this.shouldMatch,
			`Expected ${stringify(this.actualValue)} ${
				!this.shouldMatch ? "not " : ""
			}` + `to contain ${stringify(expectedContent)}.`,
			expectedContent,
			{
				actualContainer: this.actualValue,
				expectedContent,
			}
		);
	}
}
