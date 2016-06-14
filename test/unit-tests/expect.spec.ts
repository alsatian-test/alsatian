import { FunctionCallMatchError } from "../../core/errors/function-call-match-error";
import { ErrorMatchError } from "../../core/errors/error-match-error";
import { ExactMatchError } from "../../core/errors/exact-match-error";
import { Expect, Test, TestCase } from "../../core/alsatian-core";

export class ExpectTests {

   @Test()
   public nullShouldNotThrowError() {
      let expect = Expect(null);

      Expect(() => expect.toBeNull()).not.toThrow();
   }

   @TestCase(undefined)
   @TestCase(0)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase("something")
   @TestCase({})
   @TestCase({ with: "something" })
   @TestCase([])
   @TestCase([ 1 ])
   @TestCase([ 1, 2 ])
   public nullShouldThrowErrorForNonNullValues(value: any) {
      let expect = Expect(value);

      Expect(() => expect.toBeNull()).toThrow();
   }

   @TestCase(undefined)
   @TestCase(0)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase("something")
   @TestCase({})
   @TestCase({ with: "something" })
   @TestCase([])
   @TestCase([ 1 ])
   @TestCase([ 1, 2 ])
   public nullShouldThrowCorrectErrorWithCorrectMessageForNonNullValues(value: any) {
      let expect = Expect(value);

      let expectedErrorMessage = "Expected " + JSON.stringify(value) + " to be null.";

      Expect(() => expect.toBeNull()).toThrowError(<any>ExactMatchError, expectedErrorMessage);
   }

   @Test()
   public notNullShouldThrowError() {
      let expect = Expect(null);

      let expectedErrorMessage = "Expected null not to be null.";

      Expect(() => expect.not.toBeNull()).toThrowError(<any>ExactMatchError, expectedErrorMessage);
   }

   @TestCase(undefined)
   @TestCase(0)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase("something")
   @TestCase({})
   @TestCase({ with: "something" })
   @TestCase([])
   @TestCase([ 1 ])
   @TestCase([ 1, 2 ])
   public notNullShouldNotThrowErrorForNonNullValues(value: any) {
      let expect = Expect(value);

      Expect(() => expect.not.toBeNull()).not.toThrow();
   }

   @TestCase(null)
   @TestCase(0)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase("something")
   @TestCase({})
   @TestCase({ with: "something" })
   @TestCase([])
   @TestCase([ 1 ])
   @TestCase([ 1, 2 ])
   public definedShouldNotThrowError(value: any) {
      let expect = Expect(value);

      Expect(() => expect.toBeDefined()).not.toThrow();
   }

   @Test()
   public definedShouldThrowErrorForUndefined() {
      let expect = Expect(undefined);

      Expect(() => expect.toBeDefined()).toThrow();
   }

   @Test()
   public definedShouldThrowCorrectErrorWithCorrectMessageForUndefined() {
      let expect = Expect(undefined);

      let expectedErrorMessage = "Expected undefined not to be undefined.";

      Expect(() => expect.toBeDefined()).toThrowError(<any>ExactMatchError, expectedErrorMessage);
   }

   @TestCase(null)
   @TestCase(0)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase("something")
   @TestCase({})
   @TestCase({ with: "something" })
   @TestCase([])
   @TestCase([ 1 ])
   @TestCase([ 1, 2 ])
   public notDefinedShouldThrowError(value: any) {
      let expect = Expect(value);

      let expectedErrorMessage = "Expected " + JSON.stringify(value) + " to be undefined.";

      Expect(() => expect.not.toBeDefined()).toThrowError(<any>ExactMatchError, expectedErrorMessage);
   }

   @Test()
   public notDefinedShouldNotThrowErrorForUndefined() {
      let expect = Expect(undefined);

      Expect(() => expect.not.toBeDefined()).not.toThrow();
   }
}
