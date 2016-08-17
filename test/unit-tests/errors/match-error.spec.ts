import { Expect, TestCase, MatchError } from "../../../core/alsatian-core";

export class MatchErrorTests {

   @TestCase("something")
   @TestCase("something else")
   @TestCase("another thing")
   public shouldStoreMessage(expectedMessage: string) {
      let error = new MatchError(null, null, expectedMessage);

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
      let error = new MatchError(null, expectedValue, "");

      Expect(error.expectedValue).toBe(expectedValue);
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
      let error = new MatchError(actualValue, null, "");

      Expect(error.actualValue).toBe(actualValue);
   }
 }
