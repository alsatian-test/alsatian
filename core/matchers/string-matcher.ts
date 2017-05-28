import { ContentsMatchError, EmptyMatchError, RegexMatchError } from "../errors";
import { ContainerMatcher } from "./container-matcher";

/**
 * Compares strings
 */
export class StringMatcher extends ContainerMatcher<string, string> {

   /**
    * Checks that a value conforms to a regular expression
    * @param regex - the regular expression that the actual value should match
    */
   public toMatch(regex: RegExp) {
      if (regex === null || regex === undefined) {
         throw new TypeError("toMatch regular expression must not be null or undefined.");
      }

      if (typeof this.actualValue !== "string") {
         throw new TypeError("toMatch must only be used to match on strings.");
      }

      if (!regex.test(this.actualValue) === this.shouldMatch) {
         throw new RegexMatchError(this.actualValue, regex, this.shouldMatch);
      }
   }
}
