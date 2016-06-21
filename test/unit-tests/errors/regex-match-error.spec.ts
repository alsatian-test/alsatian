import { RegexMatchError } from "../../../core/errors/regex-match-error";
import { Expect, TestCase } from "../../../core/alsatian-core";

export class EqualMatchErrorTests {

   @TestCase("thing", /something/)
   @TestCase("another thing", /this and that/)
   public shouldMatchMessage(actualValue: any, expectedRegex: RegExp) {
      let error = new RegexMatchError(actualValue, expectedRegex, true);

      Expect(error.message).toBe("Expected " + JSON.stringify(actualValue) + " to conform to " + expectedRegex + ".");
   }

   @TestCase("something", /another thing/)
   @TestCase("another thing", /thing/)
   public shouldNotMatchMessage(actualValue: any, expectedRegex: any) {
      let error = new RegexMatchError(actualValue, expectedRegex, false);

      Expect(error.message).toBe("Expected " + JSON.stringify(actualValue) + " not to conform to " + expectedRegex + ".");
   }
 }
