import { Expect, MatchError, TestCase } from "../../../core/alsatian-core";

export class MatchErrorTests {

   @TestCase("something")
   @TestCase("something else")
   @TestCase("another thing")
   public shouldStoreMessage(expectedMessage: string) {
      let error = new MatchError(expectedMessage, null, null);

      Expect(error.message).toBe(expectedMessage);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(42)
   @TestCase(4.2)
   @TestCase(-4.2)
   @TestCase("")
   @TestCase("something")
   public shouldStoreExpectedValue(expectedValue: any) {
      let error = new MatchError("", expectedValue, null);

      Expect(error.expected).toBe(expectedValue);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(42)
   @TestCase(4.2)
   @TestCase(-4.2)
   @TestCase("")
   @TestCase("something")
   public shouldStoreActualValue(actualValue: any) {
      let error = new MatchError("", null, actualValue);

      Expect(error.actual).toBe(actualValue);
   }
 }
