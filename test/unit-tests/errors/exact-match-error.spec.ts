import { Expect, TestCase } from "../../../core/alsatian-core";
import { ExactMatchError } from "../../../core/errors/exact-match-error";

export class ExactMatchErrorTests {

   @TestCase("something", "something else")
   @TestCase("", "something")
   @TestCase(0, 42)
   @TestCase(42, 0)
   public shouldMatchMessage(actualValue: any, expectedValue: any) {
      let error = new ExactMatchError(actualValue, expectedValue, true);

      Expect(error.message).toBe(`Expected ${JSON.stringify(actualValue)} to be ${JSON.stringify(expectedValue)}.`);
   }

   @TestCase(undefined, undefined)
   @TestCase(null, null)
   @TestCase(0, 0)
   @TestCase(42, 42)
   @TestCase(4.2, 4.2)
   @TestCase(-4.2, -4.2)
   @TestCase("", "")
   @TestCase("something", "something")
   public shouldNotMatchMessage(actualValue: any, expectedValue: any) {
      let error = new ExactMatchError(actualValue, expectedValue, false);

      Expect(error.message)
        .toBe(`Expected ${JSON.stringify(actualValue)} not to be ${JSON.stringify(expectedValue)}.`);
   }
 }
