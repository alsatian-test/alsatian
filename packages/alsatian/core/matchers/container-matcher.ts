import { stringify } from "../stringification";
import { ObjectMatcher } from "./object-matcher";
import { TypeMatcher } from "../spying";
import { diff } from "./diff";

/**
 * Compares container types e.g. string and Array
 */
export class ContainerMatcher<
	ContainerType extends { indexOf(content: ContentType): number },
	ContentType
> extends ObjectMatcher<ContainerType> {
	/**
	 * Checks that a string contains another string or an array contains a specific item
	 * @param expectedContent - the string or array item that the value should contain
	 */
	public toContain(expectedContent: ContentType) {
		if (
			typeof this.actualValue === "string" &&
			typeof expectedContent !== "string"
		) {
			throw new TypeError(
				"toContain cannot check whether a string contains a non string value."
			);
		}

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
