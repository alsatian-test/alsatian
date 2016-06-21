import { LessThanMatchError } from "../../../core/errors/less-than-match-error";
import { Expect, TestCase } from "../../../core/alsatian-core";

export class GreaterThanMatchErrorTests {

   @TestCase(1, 0)
   @TestCase(42, 1)
   public shouldBeLessThanMessage(actualValue: number, upperLimit: number) {
      let error = new LessThanMatchError(actualValue, upperLimit, true);

      Expect(error.message).toBe("Expected " + actualValue + " to be less than " + upperLimit + ".");
   }


   @TestCase(0, 1)
   @TestCase(2, 2)
   @TestCase(1, 42)
   public shouldNotBeLessThanMessage(actualValue: number, upperLimit: number) {
      let error = new LessThanMatchError(actualValue, upperLimit, false);

      Expect(error.message).toBe("Expected " + actualValue + " not to be less than " + upperLimit + ".");
   }
 }
