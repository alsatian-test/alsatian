import { stringify } from "../stringification";
import { ObjectMatcher } from "./object-matcher";

/**
 * Compares container types e.g. string and Array
 */
export class ContainerMatcher<
	ContainerType extends { indexOf(content: ContentType): number },
	ContentType
> extends ObjectMatcher<ContainerType> {
	/**
	 * Checks that an array contains a specific item
	 * @param expectedContent - the array item that the value should contain
	 */
	public toContain(expectedContent: ContentType) {
		this.registerMatcher(
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
