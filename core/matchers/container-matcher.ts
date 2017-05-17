import { ContentsMatchError, EmptyMatchError } from "../errors";
import { EmptyMatcher } from "./empty-matcher";

export class ContainerMatcher<ContainerType, ContentType> extends EmptyMatcher<ContainerType> {

   /**
    * Checks that a string contains another string or an array contains a specific item
    * @param expectedContent - the string or array item that the value should contain
    */
   public toContain(expectedContent: ContentType) {

      if ((this.actualValue as any).indexOf(expectedContent) === -1 === this.shouldMatch) {
         throw new ContentsMatchError(this.actualValue, expectedContent, this.shouldMatch);
      }
   }

   /**
    * Checks that an array is empty, a string is empty, or an object literal has no properties
    */
   public toBeEmpty() {
      if (null === this.actualValue || undefined === this.actualValue) {
         throw new TypeError("toBeEmpty requires value passed in to Expect not to be null or undefined");
      }

      if (((this.actualValue as any).length === 0) !== this.shouldMatch) {
         throw new EmptyMatchError(this.actualValue, this.shouldMatch);
      }
   }
}
