import { TruthyMatchError } from "../../../core/errors/truthy-match-error";
import { Expect, TestCase } from "../../../core/alsatian-core";

export class TruthyMatchErrorTests {

   @TestCase(0)
   @TestCase(-1)
   @TestCase(false)
   @TestCase("")
   public shouldBeTruthyMessage(actualValue: any) {
      let error = new TruthyMatchError(actualValue, true);

      Expect(error.message).toBe("Expected " + JSON.stringify(actualValue) + " to be truthy.");
   }

   @TestCase(1)
   @TestCase(42)
   @TestCase(true)
   @TestCase("something")
   public shouldNotBeTruthyMessage(actualValue: any) {
      let error = new TruthyMatchError(actualValue, false);

      Expect(error.message).toBe("Expected " + JSON.stringify(actualValue) + " not to be truthy.");
   }
 }
