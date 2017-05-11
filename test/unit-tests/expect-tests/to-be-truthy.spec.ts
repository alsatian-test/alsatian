import { Expect, TestCase } from "../../../core/alsatian-core";
import { TruthyMatchError } from "../../../core/errors/truthy-match-error";

export class ToBeTruthyTests {

   @TestCase(0)
   @TestCase(false)
   @TestCase("")
   public shouldBeTruthyAndIsNotThrows(actualValue: any) {
      const expect = Expect(actualValue);

      Expect(() => expect.toBeTruthy())
        .toThrowError(TruthyMatchError, "Expected " + JSON.stringify(actualValue) + " to be truthy.");
   }

   @TestCase(-1)
   @TestCase(1)
   @TestCase(42)
   @TestCase(true)
   @TestCase("something")
   public shouldBeTruthyAndIsDoesNotThrow(actualValue: any) {
      const expect = Expect(actualValue);

      Expect(() => expect.toBeTruthy()).not.toThrow();
   }

   @TestCase(0)
   @TestCase(false)
   @TestCase("")
   public shouldNotBeTruthyMessageAndIsNotDoesNotThrow(actualValue: any) {
      const expect = Expect(actualValue);

      Expect(() => expect.not.toBeTruthy()).not.toThrow();
   }

   @TestCase(-1)
   @TestCase(1)
   @TestCase(42)
   @TestCase(true)
   @TestCase("something")
   public shouldNotBeTruthyMessageAndIsThrows(actualValue: any) {
      const expect = Expect(actualValue);

      Expect(() => expect.not.toBeTruthy())
        .toThrowError(TruthyMatchError, "Expected " + JSON.stringify(actualValue) + " not to be truthy.");
   }

   @TestCase(0)
   @TestCase(false)
   @TestCase("")
   public shouldBeTruthyActualValueSet(actualValue: any) {
      let truthyError: TruthyMatchError;

      try {
         Expect(actualValue).toBeTruthy();
      }
      catch (error) {
         truthyError = error;
      }

      Expect(truthyError).toBeDefined();
      Expect(truthyError).not.toBeNull();
      Expect(truthyError.actual).toBe(actualValue);
   }

   @TestCase(-1)
   @TestCase(1)
   @TestCase(42)
   @TestCase(true)
   @TestCase("something")
   public shouldNotBeTruthyActualValueSet(actualValue: any) {

      let truthyError: TruthyMatchError;

      try {
         Expect(actualValue).not.toBeTruthy();
      }
      catch (error) {
         truthyError = error;
      }

      Expect(truthyError).toBeDefined();
      Expect(truthyError).not.toBeNull();
      Expect(truthyError.actual).toBe(actualValue);
   }

   @TestCase(0)
   @TestCase(false)
   @TestCase("")
   public shouldBeTruthyExpectedValueSetToTruthy(actualValue: any) {
      let truthyError: TruthyMatchError;

      try {
         Expect(actualValue).toBeTruthy();
      }
      catch (error) {
         truthyError = error;
      }

      Expect(truthyError).toBeDefined();
      Expect(truthyError).not.toBeNull();
      Expect(truthyError.expected).toBe("truthy");
   }

   @TestCase(-1)
   @TestCase(1)
   @TestCase(42)
   @TestCase(true)
   @TestCase("something")
   public shouldNotBeTruthyExpectedValueSetToFalsy(actualValue: any) {

      let truthyError: TruthyMatchError;

      try {
         Expect(actualValue).not.toBeTruthy();
      }
      catch (error) {
         truthyError = error;
      }

      Expect(truthyError).toBeDefined();
      Expect(truthyError).not.toBeNull();
      Expect(truthyError.expected).toBe("falsy");
   }
 }
