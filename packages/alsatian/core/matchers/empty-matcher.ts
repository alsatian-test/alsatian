import { Matcher } from "./matcher";
import { stringify } from "../stringification";

/**
 * Compares types that can be empty e.g. string, object and Array
 */
export class EmptyMatcher<T> extends Matcher<T> {
	/**
	 * Checks that an array is empty, a string is empty, or an object literal has no properties
	 */
	public toBeEmpty() {
		const actualValue = this.actualValue;
		const length = this._getLength(actualValue);

		this._registerMatcher(
			(length === 0) === this.shouldMatch,
			`Expected "${
				typeof actualValue === "string"
					? actualValue
					: stringify(actualValue)
			}" ` + `${this.shouldMatch ? "" : "not "}to be empty.`,
			"value to be empty"
		);
	}

	private _getLength(value: any) {
		if (value instanceof Map) {
			return value.size;
		}

		if (value.length !== undefined) {
			return value.length;
		}

		return Object.keys(value).length;
	}
}
