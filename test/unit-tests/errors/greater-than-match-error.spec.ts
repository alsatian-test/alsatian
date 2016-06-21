import { GreaterThanMatchError } from "../../../core/errors/greater-than-match-error";
import { Expect, TestCase } from "../../../core/alsatian-core";

export class GreaterThanMatchErrorTests {

   @TestCase(0, 1)
   @TestCase(1, 42)
   public shouldBeGreaterThanMessage(actualValue: number, lowerLimit: number) {
      let error = new GreaterThanMatchError(actualValue, lowerLimit, true);

      Expect(error.message).toBe("Expected " + actualValue + " to be greater than " + lowerLimit + ".");
   }


   @TestCase(1, 0)
   @TestCase(2, 2)
   @TestCase(42, 1)
   public shouldNotBeGreaterThanMessage(actualValue: number, lowerLimit: number) {
      let error = new GreaterThanMatchError(actualValue, lowerLimit, false);

      Expect(error.message).toBe("Expected " + actualValue + " not to be greater than " + lowerLimit + ".");
   }
 }
