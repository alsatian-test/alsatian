import { Expect, TestCase } from "../../../core/alsatian-core";
import { GreaterThanMatchError } from "../../../core/errors/greater-than-match-error";

export class GreaterThanMatchErrorTests {

   @TestCase(0, 1)
   @TestCase(1, 42)
   public shouldBeGreaterThanMessage(actualValue: number, lowerLimit: number) {
      const error = new GreaterThanMatchError(actualValue, lowerLimit, true);

      Expect(error.message).toBe("Expected " + actualValue + " to be greater than " + lowerLimit + ".");
   }

   @TestCase(1, 0)
   @TestCase(2, 2)
   @TestCase(42, 1)
   public shouldNotBeGreaterThanMessage(actualValue: number, lowerLimit: number) {
      const error = new GreaterThanMatchError(actualValue, lowerLimit, false);

      Expect(error.message).toBe("Expected " + actualValue + " not to be greater than " + lowerLimit + ".");
   }

   @TestCase(0)
   @TestCase(-1)
   @TestCase(42)
   public shouldSetActualValueToGivenValue(actualValue: number) {
      Expect(new GreaterThanMatchError(actualValue, -42, true).actual).toBe(actualValue);
   }

   @TestCase(0)
   @TestCase(-1)
   @TestCase(42)
   public shouldSetExpectedValueToGreaterThanLowerLimit(lowerLimit: number) {
      Expect(new GreaterThanMatchError(512, lowerLimit, true).expected).toBe("a number greater than " + lowerLimit);
   }

   @TestCase(0)
   @TestCase(-1)
   @TestCase(42)
   public shouldSetExpectedValueToNotGreaterhanLowerLimit(lowerLimit: number) {
      const greaterThanMatchError = new GreaterThanMatchError(512, lowerLimit, false);

      Expect(greaterThanMatchError.expected).toBe("a number not greater than " + lowerLimit);
   }
}
