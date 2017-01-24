import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { EmptyMatchError } from "../../../core/errors/empty-match-error";

export class ToBeEmptyTests {

   @TestCase([])
   @TestCase([1])
   @TestCase([1, 2])
   public emptyShouldNotThrowTypeErrorForArrays(value: any) {
      let expect = Expect(value);

      Expect(() => expect.toBeEmpty())
         .not
         .toThrowError(TypeError, "toBeEmpty requires value passed in to Expect to be an array");
   }

   @TestCase(null)
   @TestCase(0)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase("something")
   @TestCase({})
   @TestCase({ with: "something" })
   @TestCase(undefined)
   public emptyShouldThrowTypeErrorForNonArrays(value: any) {
      let expect = Expect(value);

      Expect(() => expect.toBeEmpty())
         .toThrowError(TypeError, "toBeEmpty requires value passed in to Expect to be an array");
   }

   @Test()
   public emptyShouldNotThrowErrorForEmptyArray() {
      let expect = Expect([]);

      Expect(() => expect.toBeEmpty())
         .not
         .toThrow();
   }

   @Test()
   public emptyShouldThrowErrorForNonEmptyArray() {
      let expect = Expect([0]);

      Expect(() => expect.toBeEmpty())
         .toThrowError(EmptyMatchError, "Expected \"[0]\" to be empty.");
   }

   @Test()
   public notEmptyShouldThrowErrorForEmptyArray() {
      let expect = Expect([]);

      Expect(() => expect.not.toBeEmpty())
         .toThrowError(EmptyMatchError, "Expected \"[]\" not to be empty.");
   }

   @Test()
   public notEmptyShouldNotThrowErrorForNonEmptyArray() {
      let expect = Expect([0]);

      Expect(() => expect.not.toBeEmpty())
         .not
         .toThrow();
   }
}
