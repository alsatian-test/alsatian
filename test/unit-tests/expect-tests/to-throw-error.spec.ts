import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { ErrorMatchError } from "../../../core/errors/error-match-error";

export class ToThrowErrorTests {

   @Test()
   public errorNotThrownWhenExpectedShouldThrowError() {
      let nonThrowFunction = () => {};

      Expect(() => Expect(nonThrowFunction).toThrowError(Error, "error message"))
      .toThrowError(ErrorMatchError,
         "Expected an error with message \"error message\" and type Error to have been thrown, but it wasn't.");
   }

   @Test()
   public errorThrownWhenExpectedPasses() {
      let throwFunction = () => { throw new Error("error message"); };

      Expect(() => Expect(throwFunction).toThrowError(Error, "error message"))
      .not.toThrow();
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public differentErrorThrownWhenNoneExpectedFailsWithCorrectMessage(expectedErrorType: new (...args: Array<any>) => Error, expectedErrorMessage: string) {
      let throwWrongErrorFunction = () => { throw new RangeError("another message"); };

      Expect(() => Expect(throwWrongErrorFunction).toThrowError(expectedErrorType, expectedErrorMessage))
      .toThrowError(ErrorMatchError,
         "Expected an error with message \"" + expectedErrorMessage + "\" and type " + (<any>expectedErrorType)["name"] + " to have been thrown, but it wasn't.");
   }

   @TestCase(EvalError, SyntaxError)
   @TestCase(ReferenceError, EvalError)
   @TestCase(SyntaxError, ReferenceError)
   public differentTypeErrorThrownWhenNoneExpectedFailsWithCorrectMessage(expectedErrorType: new (...args: Array<any>) => Error, actualErrorType: new (...args: Array<any>) => Error) {
      let throwWrongTypeFunction = () => { throw new actualErrorType("error message"); };

      Expect(() => Expect(throwWrongTypeFunction).toThrowError(expectedErrorType, "error message"))
      .toThrowError(ErrorMatchError,
         "Expected an error of type " + (<any>expectedErrorType)["name"] + " to have been thrown, but " + (<any>actualErrorType)["name"] + " was thrown instead.");
   }

   @TestCase("something went wrong")
   @TestCase("A much worse thing happened!")
   @TestCase("THE END IS NIGH")
   public differentMessageErrorThrownWhenNoneExpectedFailsWithCorrectMessage(expectedErrorMessage: string) {
      let throwWrongMessageFunction = () => { throw new Error("another message"); };

      Expect(() => Expect(throwWrongMessageFunction).toThrowError(Error, expectedErrorMessage))
      .toThrowError(ErrorMatchError,
         "Expected an error with message \"" + expectedErrorMessage + "\" to have been thrown, but it wasn't.");
   }

   @Test()
   public errorThrownWhenNoneExpectedShouldGiveCorrectMessage() {
      let throwFunction = () => { throw new Error("error message"); };

      Expect(() => Expect(throwFunction).not.toThrowError(Error, "error message"))
      .toThrowError(ErrorMatchError,
         "Expected an error with message \"error message\" and type Error to not have been thrown, but it was.");
   }

   @Test()
   public noErrorThrownWhenNoneExpectedPasses() {
      let nonThrowFunction = () => {};

      Expect(() => Expect(nonThrowFunction).not.toThrowError(Error, "error message"))
      .not.toThrow();
   }

   @Test()
   public differentErrorThrownWhenNoneExpectedPasses() {
      let throwWrongErrorFunction = () => { throw new RangeError("another message"); };

      Expect(() => Expect(throwWrongErrorFunction).not.toThrowError(Error, "error message"))
      .not.toThrow();
   }

   @Test()
   public differentTypeErrorThrownWhenNoneExpectedPasses() {
      let throwWrongTypeFunction = () => { throw new RangeError("error message"); };

      Expect(() => Expect(throwWrongTypeFunction).not.toThrowError(TypeError, "error message"))
      .not.toThrow();
   }

   @Test()
   public differentMessageErrorThrownWhenNoneExpectedPasses() {
      let throwWrongMessageFunction = () => { throw new Error("another message"); };

      Expect(() => Expect(throwWrongMessageFunction).not.toThrowError(Error, "error message"))
      .not.toThrow();
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase("")
   @TestCase("something")
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   public checkingWhetherNonFunctionThrowsErrorShouldThrow(actualValue: any) {
      Expect(() => Expect(actualValue).toThrowError(Error, "")).toThrowError(TypeError, "toThrowError requires value passed in to Expect to be a function.");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase("")
   @TestCase("something")
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   public checkingWhetherNonFunctionDoesNotThrowErrorShouldThrow(actualValue: any) {
      Expect(() => Expect(actualValue).not.toThrowError(Error, "")).toThrowError(TypeError, "toThrowError requires value passed in to Expect to be a function.");
   }

   @Test()
   public actualValueAndShouldMatchShouldBeSetToErrorWasNotThrown() {

      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => {}).toThrowError(Error, "this error won't be thrown.");
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.actual).toBe("error was not thrown.");
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public actualValueAndShouldMatchAndExpectedErrorShouldBeSetToErrorWasNotThrown(ExpectedErrorType: new (message: string) => Error, expectedErrorMessage: string) {

      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { }).toThrowError(ExpectedErrorType, expectedErrorMessage);
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.actual).toBe("error was not thrown.");
   }

   @TestCase(EvalError, "something went wrong", ReferenceError, "A much worse thing happened!")
   @TestCase(ReferenceError, "A much worse thing happened!", SyntaxError, "THE END IS NIGH")
   @TestCase(SyntaxError, "THE END IS NIGH", EvalError, "something went wrong")
   public actualValueAndShouldMatchAndExpectedErrorShouldBeSetToWrongErrorWasThrown(ExpectedErrorType: new (message: string) => Error, expectedErrorMessage: string, ActualErrorType: new (message: string) => Error, actualErrorMessage: string) {
      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { throw new ActualErrorType(actualErrorMessage); }).toThrowError(ExpectedErrorType, expectedErrorMessage);
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.actual).toBe(`${(<any>ActualErrorType).name} error was thrown with message "${actualErrorMessage}".`);
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public actualValueAndShouldNotMatchAndExpectedErrorShouldBeSetToWrongErrorWasThrown(ExpectedErrorType: new (message: string) => Error, expectedErrorMessage: string) {
      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { throw new ExpectedErrorType(expectedErrorMessage); }).not.toThrowError(ExpectedErrorType, expectedErrorMessage);
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.actual).toBe(`${(<any>ExpectedErrorType).name} error was thrown with message "${expectedErrorMessage}".`);
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public expectedValueAndShouldMatchShouldBeSetToErrorShouldBeThrown(ExpectedErrorType: new (message: string) => Error, expectedErrorMessage: string) {
      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { }).toThrowError(ExpectedErrorType, expectedErrorMessage);
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.expected).toBe(`${(<any>ExpectedErrorType).name} error to be thrown with message "${expectedErrorMessage}".`);
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public expectedValueAndShouldNotMatchShouldBeSetToErrorShouldNotBeThrown(ExpectedErrorType: new (message: string) => Error, expectedErrorMessage: string) {
      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { throw new ExpectedErrorType(expectedErrorMessage); }).not.toThrowError(ExpectedErrorType, expectedErrorMessage);
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.expected).toBe(`${(<any>ExpectedErrorType).name} error not to be thrown with message "${expectedErrorMessage}".`);
   }
}
