import { RegexMatchError } from "../../../core/errors/regex-match-error";
import { Expect, TestCase } from "../../../core/alsatian-core";

export class ToMatchTests {

   @TestCase("thing", /something/)
   @TestCase("another thing", /this and that/)
   public shouldMatchAndDoesNotThrows(actualValue: any, expectedRegex: RegExp) {
      let expect = Expect(actualValue);

      Expect(() => expect.toMatch(expectedRegex)).toThrowError(RegexMatchError, "Expected " + JSON.stringify(actualValue) + " to conform to " + expectedRegex + ".");
   }

   @TestCase("something", /thing/)
   @TestCase("another thing", /another thing/)
   public shouldMatchAndDoesDoesNotThrow(actualValue: any, expectedRegex: RegExp) {
      let expect = Expect(actualValue);

      Expect(() => expect.toMatch(expectedRegex)).not.toThrow();
   }

   @TestCase("thing", /something/)
   @TestCase("another thing", /this and that/)
   public shouldNotMatchAndDoesNotDoesNotThrow(actualValue: any, expectedRegex: RegExp) {
      let expect = Expect(actualValue);

      Expect(() => expect.not.toMatch(expectedRegex)).not.toThrow();
   }

   @TestCase("something", /thing/)
   @TestCase("another thing", /another thing/)
   public shouldNotMatchAndDoesThrows(actualValue: any, expectedRegex: RegExp) {
      let expect = Expect(actualValue);

      Expect(() => expect.not.toMatch(expectedRegex)).toThrowError(RegexMatchError, "Expected " + JSON.stringify(actualValue) + " not to conform to " + expectedRegex + ".");
   }
 }
