import { GreaterThanMatchError } from "../../../core/errors/greater-than-match-error";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class ToBeGreaterThanTests {

   @TestCase(1, 0)
   @TestCase(42, 1)
   public greaterThanShouldNotThrowError(value: number, lowerLimit: number) {
      let expect = Expect(value);

      Expect(() => expect.toBeGreaterThan(lowerLimit)).not.toThrow();
   }

   @TestCase(1, 1)
   @TestCase(42, 42)
   public equalShouldThrowError(value: number, lowerLimit: number) {
      let expect = Expect(value);
      Expect(() => expect.toBeGreaterThan(lowerLimit)).toThrow();
   }

   @TestCase(0, 1)
   @TestCase(42, 1)
   public lessThanShouldThrowError(value: number, lowerLimit: number) {
      let expect = Expect(value);
      Expect(() => expect.toBeGreaterThan(lowerLimit)).toThrow();
   }

   @TestCase(1, 0)
   @TestCase(42, 1)
   public notGreaterThanShouldThrowError(value: number, lowerLimit: number) {
      let expect = Expect(value);

      Expect(() => expect.not.toBeGreaterThan(lowerLimit)).toThrow();
   }

   @TestCase(1, 1)
   @TestCase(42, 42)
   public notEqualShouldNotThrowError(value: number, lowerLimit: number) {
      let expect = Expect(value);
      Expect(() => expect.not.toBeGreaterThan(lowerLimit)).not.toThrow();
   }

   @TestCase(0, 1)
   @TestCase(42, 1)
   public notLessThanShouldNotThrowError(value: number, lowerLimit: number) {
      let expect = Expect(value);
      Expect(() => expect.not.toBeGreaterThan(lowerLimit)).not.toThrow();
   }

   @TestCase(0, 1)
   @TestCase(1, 42)
   public shouldBeGreaterThanMessage(value: number, lowerLimit: number) {
      let expect = Expect(value);

      Expect(() => expect.toBeGreaterThan(lowerLimit)).toThrowError(<any>GreaterThanMatchError, "Expected " + value + " to be greater than " + lowerLimit + ".");
   }


   @TestCase(1, 0)
   @TestCase(2, 2)
   @TestCase(42, 1)
   public shouldNotBeGreaterThanMessage(value: number, lowerLimit: number) {
      let expect = Expect(value);

      Expect(() => expect.not.toBeGreaterThan(lowerLimit)).toThrowError(<any>GreaterThanMatchError, "Expected " + value + " not to be greater than " + lowerLimit + ".");
   }

}
