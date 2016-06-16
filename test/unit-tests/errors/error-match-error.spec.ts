import { ErrorMatchError } from "../../../core/errors/error-match-error";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class ErrorMatchErrorTests {

   @Test()
   public noActualErrorShouldGiveCorrectMessage() {
      let error = new ErrorMatchError(null, true);

      Expect(error.message).toBe("Expected an error to be thrown but no errors were thown.");
   }

   @Test()
   public actualErrorThrownWhenNoneExpectedShouldGiveCorrectMessage() {
      let error = new ErrorMatchError(new Error(), false);

      Expect(error.message).toBe("Expected an error not to be thrown but an error was thown.");
   }
}
