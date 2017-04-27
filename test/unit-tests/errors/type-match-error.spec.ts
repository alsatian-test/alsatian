import { Expect, TestCase } from "../../../core/alsatian-core";
import { TypeMatchError } from "../../../core/errors/type-match-error";

export class TypeMatchErrorTests {

   @TestCase("thing")
   @TestCase("another thing")
   public testTypeMatchErrorShouldMatchMessage(actualValue: any) {
      let error = new TypeMatchError(actualValue);

      Expect(error.message).toBe(actualValue);
   }

   @TestCase("something")
   @TestCase("another thing")
   public testTypeMatchErrorShouldNotMatchMessage(actualValue: any) {
      let error = new TypeMatchError(actualValue + " more");

      Expect(error.message).not.toBe(actualValue);
   }
}
