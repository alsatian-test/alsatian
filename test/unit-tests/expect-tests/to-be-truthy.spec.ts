import { TruthyMatchError } from "../../../core/errors/truthy-match-error";
import { Expect, TestCase } from "../../../core/alsatian-core";

export class ToBeTruthyTests {

   @TestCase(0)
   @TestCase(false)
   @TestCase("")
   public shouldBeTruthyAndIsNotThrows(actualValue: any) {
      let expect = Expect(actualValue);

      Expect(() => expect.toBeTruthy()).toThrowError(TruthyMatchError, "Expected " + JSON.stringify(actualValue) + " to be truthy.");
   }

   @TestCase(-1)
   @TestCase(1)
   @TestCase(42)
   @TestCase(true)
   @TestCase("something")
   public shouldBeTruthyAndIsDoesNotThrow(actualValue: any) {
      let expect = Expect(actualValue);

      Expect(() => expect.toBeTruthy()).not.toThrow();
   }

   @TestCase(0)
   @TestCase(false)
   @TestCase("")
   public shouldNotBeTruthyMessageAndIsNotDoesNotThrow(actualValue: any) {
      let expect = Expect(actualValue);

      Expect(() => expect.not.toBeTruthy()).not.toThrow();
   }

   @TestCase(-1)
   @TestCase(1)
   @TestCase(42)
   @TestCase(true)
   @TestCase("something")
   public shouldNotBeTruthyMessageAndIsThrows(actualValue: any) {
      let expect = Expect(actualValue);

      Expect(() => expect.not.toBeTruthy()).toThrowError(TruthyMatchError, "Expected " + JSON.stringify(actualValue) + " not to be truthy.");
   }
 }
