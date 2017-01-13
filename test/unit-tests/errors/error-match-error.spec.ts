import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { ErrorMatchError } from "../../../core/errors/error-match-error";

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

   @Test()
   public actualValueAndShouldMatchShouldBeSetToErrorWasNotThrown() {
      let error = new ErrorMatchError(undefined, true);

      Expect(error.actual).toBe("error was not thrown.");
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public actualValueAndShouldNotMatchShouldBeSetToErrorWasThrown(ActualErrorType: new (message: string) => Error, actualErrorMessage: string) {
      let error = new ErrorMatchError(new ActualErrorType(actualErrorMessage), false);

      Expect(error.actual).toBe(`${(<any>ActualErrorType).name} error was thrown with message "${actualErrorMessage}".`);
   }

   @Test()
   public expectedValueAndShouldMatchShouldBeSetToErrorToBeThrown() {
      let error = new ErrorMatchError(undefined, true);

      Expect(error.expected).toBe("error to be thrown.");
   }

   @Test()
   public expectedValueAndShouldNotMatchShouldBeSetToErrorNotToBeThrown() {
      let error = new ErrorMatchError(new Error(), false);

      Expect(error.expected).toBe("error not to be thrown.");
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public actualValueAndShouldMatchAndExpectedErrorShouldBeSetToErrorWasNotThrown(ExpectedErrorType: new (message: string) => Error, expectedErrorMessage: string) {
      let error = new ErrorMatchError(undefined, true, ExpectedErrorType, expectedErrorMessage);

      Expect(error.actual).toBe("error was not thrown.");
   }

   @TestCase(EvalError, "something went wrong", ReferenceError, "A much worse thing happened!")
   @TestCase(ReferenceError, "A much worse thing happened!", SyntaxError, "THE END IS NIGH")
   @TestCase(SyntaxError, "THE END IS NIGH", EvalError, "something went wrong")
   public actualValueAndShouldMatchAndExpectedErrorShouldBeSetToWrongErrorWasThrown(ExpectedErrorType: new (message: string) => Error, expectedErrorMessage: string, ActualErrorType: new (message: string) => Error, actualErrorMessage: string) {
      let error = new ErrorMatchError(new ActualErrorType(actualErrorMessage), true, ExpectedErrorType, expectedErrorMessage);

      Expect(error.actual).toBe(`${(<any>ActualErrorType).name} error was thrown with message "${actualErrorMessage}".`);
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public actualValueAndShouldNotMatchAndExpectedErrorShouldBeSetToWrongErrorWasThrown(ExpectedErrorType: new (message: string) => Error, expectedErrorMessage: string) {
      let error = new ErrorMatchError(new ExpectedErrorType(expectedErrorMessage), false, ExpectedErrorType, expectedErrorMessage);

      Expect(error.actual).toBe(`${(<any>ExpectedErrorType).name} error was thrown with message "${expectedErrorMessage}".`);
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public expectedValueAndShouldMatchShouldBeSetToErrorShouldBeThrown(ExpectedErrorType: new (message: string) => Error, expectedErrorMessage: string) {
      let error = new ErrorMatchError(undefined, true, ExpectedErrorType, expectedErrorMessage);

      Expect(error.expected).toBe(`${(<any>ExpectedErrorType).name} error to be thrown with message "${expectedErrorMessage}".`);
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public expectedValueAndShouldNotMatchShouldBeSetToErrorShouldNotBeThrown(ExpectedErrorType: new (message: string) => Error, expectedErrorMessage: string) {
      let error = new ErrorMatchError(new ExpectedErrorType(expectedErrorMessage), false, ExpectedErrorType, expectedErrorMessage);

      Expect(error.expected).toBe(`${(<any>ExpectedErrorType).name} error not to be thrown with message "${expectedErrorMessage}".`);
   }
}
