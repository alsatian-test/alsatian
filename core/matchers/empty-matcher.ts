import { ContentsMatchError, EmptyMatchError } from "../errors";
import { Matcher } from "./matcher";

export class EmptyMatcher<T> extends Matcher<T> {

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
