import { ContentsMatchError, EmptyMatchError, RegexMatchError } from "../errors";
import { Matcher } from "./";

export class StringMatcher extends Matcher<string> {

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

   /**
    * Checks that a string contains another string or an array contains a specific item
    * @param expectedContent - the string or array item that the value should contain
    */
   public toContain(expectedContent: string) {

      if (typeof this.actualValue !== "string") {
         throw new TypeError("toContain must only be used to check whether strings contain given contents.");
      }

      if (typeof this.actualValue === "string" && typeof expectedContent !== "string") {
         throw new TypeError("toContain cannot check whether a string contains a non string value.");
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

      if (typeof this.actualValue !== "string" || Array.isArray(this.actualValue)) {
         throw new TypeError("toBeEmpty requires value passed in to Expect to be an array, string or object literal");
      }

      if ((this.actualValue.length === 0) !== this.shouldMatch) {
         throw new EmptyMatchError(this.actualValue, this.shouldMatch);
      }
   }
}
