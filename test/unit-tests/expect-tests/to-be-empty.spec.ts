import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { EmptyMatchError } from "../../../core/errors/empty-match-error";
import { TypeMatchError } from "../../../core/errors/type-match-error";

class DummyClass { }

export class ToBeEmptyTests {

   private readonly _typeErrorMessage: string =
      "toBeEmpty requires value passed in to Expect to be an array, string or object literal";

   @TestCase([])
   @TestCase([1])
   @TestCase([1, 2])
   public emptyShouldNotThrowTypeErrorForArrays(value: any) {
      const expect = Expect(value);

      Expect(() => expect.toBeEmpty())
         .not
         .toThrowError(TypeMatchError, this._typeErrorMessage);
   }

   @TestCase("")
   @TestCase("string")
   public emptyShouldNotThrowTypeErrorForStrings(value: any) {
      const expect = Expect(value);

      Expect(() => expect.toBeEmpty())
         .not
         .toThrowError(TypeMatchError, this._typeErrorMessage);
   }

   @TestCase({})
   @TestCase({ a: true })
   public emptyShouldNotThrowTypeErrorForObjectLiterals(value: any) {
      const expect = Expect(value);

      Expect(() => expect.toBeEmpty())
         .not
         .toThrowError(TypeMatchError, this._typeErrorMessage);
   }

   @TestCase(null)
   @TestCase(undefined)
   public emptyShouldThrowTypeErrorForNullTypes(value: any) {
      const expect = Expect(value);

      Expect(() => expect.toBeEmpty())
         .toThrowError(TypeMatchError, "toBeEmpty requires value passed in to Expect not to be null or undefined");
   }

   @TestCase(0)
   @TestCase(42)
   @TestCase(-42)
   @TestCase(true)
   @TestCase(new Date())
   @TestCase(new Error())
   @TestCase(new DummyClass())
   public emptyShouldThrowTypeErrorForInvalidTypes(value: any) {
      const expect = Expect(value);

      Expect(() => expect.toBeEmpty())
         .toThrowError(TypeMatchError, this._typeErrorMessage);
   }

   @Test()
   public emptyShouldNotThrowErrorForEmptyArray() {
      const expect = Expect([]);

      Expect(() => expect.toBeEmpty())
         .not
         .toThrow();
   }

   @Test()
   public emptyShouldThrowErrorForNonEmptyArray() {
      const expect = Expect([0]);

      Expect(() => expect.toBeEmpty())
         .toThrowError(EmptyMatchError, "Expected \"[0]\" to be empty.");
   }

   @Test()
   public notEmptyShouldThrowErrorForEmptyArray() {
      const expect = Expect([]);

      Expect(() => expect.not.toBeEmpty())
         .toThrowError(EmptyMatchError, "Expected \"[]\" not to be empty.");
   }

   @Test()
   public notEmptyShouldNotThrowErrorForNonEmptyArray() {
      const expect = Expect([0]);

      Expect(() => expect.not.toBeEmpty())
         .not
         .toThrow();
   }

   @Test()
   public emptyShouldNotThrowErrorForEmptyString() {
      const expect = Expect("");

      Expect(() => expect.toBeEmpty())
         .not
         .toThrow();
   }

   @Test()
   public emptyShouldThrowErrorForNonEmptyString() {
      const expect = Expect("string");

      Expect(() => expect.toBeEmpty())
         .toThrowError(EmptyMatchError, "Expected \"string\" to be empty.");
   }

   @Test()
   public notEmptyShouldThrowErrorForEmptyString() {
      const expect = Expect("");

      Expect(() => expect.not.toBeEmpty())
         .toThrowError(EmptyMatchError, "Expected \"\" not to be empty.");
   }

   @Test()
   public notEmptyShouldNotThrowErrorForNonEmptyString() {
      const expect = Expect("string");

      Expect(() => expect.not.toBeEmpty())
         .not
         .toThrow();
   }

   @Test()
   public emptyShouldNotThrowErrorForEmptyObject() {
      const expect = Expect({});

      Expect(() => expect.toBeEmpty())
         .not
         .toThrow();
   }

   @Test()
   public emptyShouldThrowErrorForNonEmptyObject() {
      const expect = Expect({ a: true });

      Expect(() => expect.toBeEmpty())
         .toThrowError(EmptyMatchError, "Expected \"{\"a\":true}\" to be empty.");
   }

   @Test()
   public notEmptyShouldThrowErrorForEmptyObject() {
      const expect = Expect({});

      Expect(() => expect.not.toBeEmpty())
         .toThrowError(EmptyMatchError, "Expected \"{}\" not to be empty.");
   }

   @Test()
   public notEmptyShouldNotThrowErrorForNonEmptyObject() {
      const expect = Expect({ a: true });

      Expect(() => expect.not.toBeEmpty())
         .not
         .toThrow();
   }
}
