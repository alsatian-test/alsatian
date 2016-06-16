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
   @TestCase(ReferenceError, Error)
   @TestCase(ReferenceError, EvalError)
   @TestCase(ReferenceError, SyntaxError)
   @TestCase(ReferenceError, TypeError)
   @TestCase(ReferenceError, URIError)
   @TestCase(SyntaxError, Error)
   @TestCase(SyntaxError, EvalError)
   @TestCase(SyntaxError, ReferenceError)
   @TestCase(SyntaxError, TypeError)
   @TestCase(SyntaxError, URIError)
   @TestCase(TypeError, Error)
   @TestCase(TypeError, EvalError)
   @TestCase(TypeError, ReferenceError)
   @TestCase(TypeError, TypeError)
   @TestCase(TypeError, URIError)
   @TestCase(URIError, Error)
   @TestCase(URIError, EvalError)
   @TestCase(URIError, ReferenceError)
   @TestCase(URIError, TypeError)
   @TestCase(URIError, SyntaxError)
   public actualErrorIsNotCorrectTypeGivesCorrectMessage(ActualErrorType: new () => Error, ExpectedErrorType: new () => Error) {
      let error = new ErrorMatchError(new ActualErrorType(), true, ExpectedErrorType);

      Expect(error.message).toBe("Expected an error of type " + ExpectedErrorType["name"] + " to have been thrown, but " + ActualErrorType["name"] + "was thrown instead.");
   }

   @TestCase(Error, EvalError)
   @TestCase(Error, ReferenceError)
   @TestCase(Error, SyntaxError)
   @TestCase(Error, TypeError)
   @TestCase(Error, URIError)
   @TestCase(ReferenceError, Error)
   @TestCase(ReferenceError, EvalError)
   @TestCase(ReferenceError, SyntaxError)
   @TestCase(ReferenceError, TypeError)
   @TestCase(ReferenceError, URIError)
   @TestCase(SyntaxError, Error)
   @TestCase(SyntaxError, EvalError)
   @TestCase(SyntaxError, ReferenceError)
   @TestCase(SyntaxError, TypeError)
   @TestCase(SyntaxError, URIError)
   @TestCase(TypeError, Error)
   @TestCase(TypeError, EvalError)
   @TestCase(TypeError, ReferenceError)
   @TestCase(TypeError, TypeError)
   @TestCase(TypeError, URIError)
   @TestCase(URIError, Error)
   @TestCase(URIError, EvalError)
   @TestCase(URIError, ReferenceError)
   @TestCase(URIError, TypeError)
   @TestCase(URIError, SyntaxError)
   public actualErrorIsCorrectTypeButShouldntBeGivesCorrectMessage(ActualErrorType: new () => Error, ExpectedErrorType: new () => Error) {
      let error = new ErrorMatchError(new ActualErrorType(), true, ExpectedErrorType);

      Expect(error.message).toBe("Expected an error of type " + ExpectedErrorType["name"] + " to have been thrown, but it shoudln't have been.");
   }
}
