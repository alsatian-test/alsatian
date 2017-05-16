import { ContentsMatchError, EmptyMatchError } from "../errors";
import { Matcher } from "./matcher";

export class ArrayMatcher<T> extends Matcher<Array<T>> {

    public constructor(actualValue: Array<T>) {
        super(actualValue);
    }

   /**
    * Checks that a string contains another string or an array contains a specific item
    * @param expectedContent - the string or array item that the value should contain
    */
   public toContain(expectedContent: T) {

      if (this.actualValue instanceof Array === false) {
         throw new TypeError("toContain must only be used to check whether arrays contain given contents.");
      }

      if (this.actualValue.indexOf(expectedContent) === -1 === this.shouldMatch) {
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

      if (!Array.isArray(this.actualValue)) {
         throw new TypeError("toBeEmpty requires value passed in to Expect to be an array.");
      }

      if ((this.actualValue.length === 0) !== this.shouldMatch) {
         throw new EmptyMatchError(this.actualValue, this.shouldMatch);
      }
   }
}
