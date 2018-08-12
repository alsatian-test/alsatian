import { ContentsMatchError } from "../errors";
import { EmptyMatcher } from "./empty-matcher";

/**
 * Compares container types e.g. string and Array
 */
export class ContainerMatcher<ContainerType, ContentType> extends EmptyMatcher<
  ContainerType
> {
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

    if (
      ((this.actualValue as any).indexOf(expectedContent) === -1) ===
      this.shouldMatch
    ) {
      throw new ContentsMatchError(
        this.actualValue,
        expectedContent,
        this.shouldMatch
      );
    }
  }
}
