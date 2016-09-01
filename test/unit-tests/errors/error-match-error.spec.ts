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

   @TestCase(Error, EvalError)
   @TestCase(Error, ReferenceError)
   @TestCase(Error, SyntaxError)
   @TestCase(Error, TypeError)
   @TestCase(Error, URIError)
   @TestCase(ReferenceError, EvalError)
   @TestCase(ReferenceError, SyntaxError)
   @TestCase(ReferenceError, TypeError)
   @TestCase(ReferenceError, URIError)
   @TestCase(SyntaxError, EvalError)
   @TestCase(SyntaxError, ReferenceError)
   @TestCase(SyntaxError, TypeError)
   @TestCase(SyntaxError, URIError)
   @TestCase(TypeError, EvalError)
   @TestCase(TypeError, ReferenceError)
   @TestCase(TypeError, SyntaxError)
   @TestCase(TypeError, URIError)
   @TestCase(URIError, EvalError)
   @TestCase(URIError, ReferenceError)
   @TestCase(URIError, TypeError)
   @TestCase(URIError, SyntaxError)
   public actualErrorIsNotCorrectTypeGivesCorrectMessage(ActualErrorType: new () => Error, ExpectedErrorType: new () => Error) {
      let error = new ErrorMatchError(new ActualErrorType(), true, ExpectedErrorType);

      Expect(error.message).toBe("Expected an error of type " + (<any>ExpectedErrorType)["name"] + " to have been thrown, but " + (<any>ActualErrorType)["name"] + " was thrown instead.");
   }

   @TestCase(EvalError)
   @TestCase(ReferenceError)
   @TestCase(SyntaxError)
   @TestCase(TypeError)
   @TestCase(URIError)
   public actualErrorIsMatchingTypeButShouldntBeGivesCorrectMessage(ErrorType: new () => Error) {
      let error = new ErrorMatchError(new ErrorType(), false, ErrorType);

      Expect(error.message).toBe("Expected an error of type " + (<any>ErrorType)["name"] + " to not have been thrown, but it was.");
   }

   @TestCase("something went wrong")
   @TestCase("A much worse thing happened!")
   @TestCase("THE END IS NIGH")
   public actualErrorHasIncorrectMessageGivesCorrectMessage(message: string) {
      let error = new ErrorMatchError(new Error(), true, null, message);

      Expect(error.message).toBe("Expected an error with message \"" + message + "\" to have been thrown, but it wasn't.");
   }

   @TestCase("something went wrong")
   @TestCase("A much worse thing happened!")
   @TestCase("THE END IS NIGH")
   public actualErrorHasMatchingMessageButShouldntBeGivesCorrectMessage(message: string) {
      let error = new ErrorMatchError(new Error(message), false, null, message);

      Expect(error.message).toBe("Expected an error with message \"" + message + "\" to not have been thrown, but it was.");
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public actualErrorHasIncorrectTypeAndMessageGivesCorrectMessage(ExpectedErrorType: new () => Error, message: string) {
      let error = new ErrorMatchError(new Error(), true, ExpectedErrorType, message);

      Expect(error.message).toBe("Expected an error with message \"" + message + "\" and type " + (<any>ExpectedErrorType)["name"] + " to have been thrown, but it wasn't.");
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public actualErrorHasMatchingMessageAndTypeButShouldntBeGivesCorrectMessage(ExpectedErrorType: new (message: string) => Error, message: string) {
      let error = new ErrorMatchError(new ExpectedErrorType(message), false, ExpectedErrorType, message);

      Expect(error.message).toBe("Expected an error with message \"" + message + "\" and type " + (<any>ExpectedErrorType)["name"] + " to not have been thrown, but it was.");
   }
}
