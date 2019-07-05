import { PropertySpy } from "../spying";
import { Matcher } from "./matcher";
import { stringify } from "../stringification";

/**
 * Checks whether properties have performed as expected
 */
export class PropertyMatcher<PropertyType> extends Matcher<
	PropertySpy<PropertyType>
> {
	/**
	 * Checks that a property spy has been set
	 */
	public toHaveBeenSet() {
		this._registerMatcher(
			(this.actualValue.setCalls.length === 0) !== this.shouldMatch,
			`Expected property ${!this.shouldMatch ? "not " : ""}to be set`,
			`property ${this.shouldMatch ? "" : "not "}to have been set`
		);
	}

	/**
	 * Checks that a property spy has been set to a specific value
	 * @param value - a value to which the property should be set to
	 */
	public toHaveBeenSetTo(value: PropertyType) {
		const stringifiedValue = stringify(value);

		this._registerMatcher(
			this.actualValue.setCalls.some(
				call => call.args[0] === value
			) === this.shouldMatch,
			`Expected property ${!this.shouldMatch ? "not " : ""}to be set to ${stringifiedValue}.`,
			`property ${this.shouldMatch ? "" : "not "}to be set to ${stringifiedValue}.`,
			{
				actualValues: this.actualValue.setCalls.map(call => call.args[0]),
				expectedValue: value
			}
		);
	}
}
