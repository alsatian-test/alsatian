import { LessThanMatchError } from "../../../core/errors/less-than-match-error";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class ToBeLessThanTests {

   @TestCase(1, 50)
   @TestCase(42, 200)
   public lessThanShouldNotThrowError(value: number, upperLimit: number) {
      let expect = Expect(value);
      Expect(
          () => expect.toBeLessThan(upperLimit)
      ).not.toThrow();
   }

   @TestCase(1, 1)
   @TestCase(42, 42)
   public equalShouldThrowError(value: number, upperLimit: number) {
      let expect = Expect(value);
      Expect(
          () => expect.toBeLessThan(upperLimit)
      ).toThrow();
   }

   @TestCase(22, 1)
   @TestCase(55, 5)
   public greaterThanShouldThrowError(value: number, upperLimit: number) {
      let expect = Expect(value);
      Expect(
          () => expect.toBeLessThan(upperLimit)
      ).toThrow();
   }

   @TestCase(1, 50)
   @TestCase(42, 200)
   public lessThanShouldThrowWhenExpectedNotLessThan(value: number, upperLimit: number) {
      let expect = Expect(value);
      Expect(
          () => expect.not.toBeLessThan(upperLimit)
      ).toThrow();
   }

   @TestCase(1, 1)
   @TestCase(42, 42)
   public equalShouldNotThrowWhenExpectedNotLessThan(value: number, upperLimit: number) {
      let expect = Expect(value);
      Expect(
          () => expect.not.toBeLessThan(upperLimit)
      ).not.toThrow();
   }

   @TestCase(20, 1)
   @TestCase(125, 42)
   public greaterThanShouldNotThrowWhenExpectedNotLessThan(value: number, upperLimit: number) {
      let expect = Expect(value);
      Expect(
          () => expect.not.toBeLessThan(upperLimit)
      ).not.toThrow();
   }

   @TestCase(7, 1)
   @TestCase(72, 42)
   public shouldThrowLessThanMatchErrorWithCorrectMessage(value: number, upperLimit: number) {
      let expect = Expect(value);
      Expect(
          () => expect.toBeLessThan(upperLimit)
      ).toThrowError(<any>LessThanMatchError, "Expected " + value + " to be less than " + upperLimit + ".");
   }


   @TestCase(1, 7)
   @TestCase(42, 72)
   public shouldThrowLessThanMatchErrorWithCorrectNotMessage(value: number, upperLimit: number) {
      let expect = Expect(value);
      Expect(
          () => expect.not.toBeLessThan(upperLimit)
      ).toThrowError(<any>LessThanMatchError, "Expected " + value + " not to be less than " + upperLimit + ".");
   }

}
