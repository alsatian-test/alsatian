import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { ErrorMatchError } from "../../../core/errors/error-match-error";
import { INameable } from "../../../core/_interfaces";

export class ToThrowErrorTests {

   @Test()
   public errorNotThrownWhenExpectedShouldThrowError() {
      const nonThrowFunction = () => {};

      Expect(() => Expect(nonThrowFunction).toThrowError(Error, "error message"))
      .toThrowError(ErrorMatchError,
         "Expected an error with message \"error message\" and type Error to have been thrown, but it wasn't.");
   }

   @Test()
   public errorThrownWhenExpectedPasses() {
      const throwFunction = () => { throw new Error("error message"); };

      Expect(() => Expect(throwFunction).toThrowError(Error, "error message"))
      .not.toThrow();
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public differentErrorThrownWhenNoneExpectedFailsWithCorrectMessage(
                                                            expectedErrorType: new (...args: Array<any>) => Error,
                                                            expectedErrorMessage: string) {

      const throwWrongErrorFunction = () => { throw new RangeError("another message"); };

      Expect(() => Expect(throwWrongErrorFunction).toThrowError(expectedErrorType, expectedErrorMessage))
      .toThrowError(ErrorMatchError,
         "Expected an error with message \"" + expectedErrorMessage +
         "\" and type " + (expectedErrorType as INameable).name + " to have been thrown, but it wasn't.");
   }

   @TestCase(EvalError, SyntaxError)
   @TestCase(ReferenceError, EvalError)
   @TestCase(SyntaxError, ReferenceError)
   public differentTypeErrorThrownWhenNoneExpectedFailsWithCorrectMessage(
                                                            expectedErrorType: new (...args: Array<any>) => Error,
                                                            actualErrorType: new (...args: Array<any>) => Error) {

      const throwWrongTypeFunction = () => { throw new actualErrorType("error message"); };

      Expect(() => Expect(throwWrongTypeFunction).toThrowError(expectedErrorType, "error message"))
      .toThrowError(ErrorMatchError,
         "Expected an error of type " + (expectedErrorType as INameable).name +
         " to have been thrown, but " + (actualErrorType as INameable).name + " was thrown instead.");
   }

   @TestCase("something went wrong")
   @TestCase("A much worse thing happened!")
   @TestCase("THE END IS NIGH")
   public differentMessageErrorThrownWhenNoneExpectedFailsWithCorrectMessage(expectedErrorMessage: string) {
      const throwWrongMessageFunction = () => { throw new Error("another message"); };

      Expect(() => Expect(throwWrongMessageFunction).toThrowError(Error, expectedErrorMessage))
      .toThrowError(ErrorMatchError,
         "Expected an error with message \"" + expectedErrorMessage + "\" to have been thrown, but it wasn't.");
   }

   @Test()
   public errorThrownWhenNoneExpectedShouldGiveCorrectMessage() {
      const throwFunction = () => { throw new Error("error message"); };

      Expect(() => Expect(throwFunction).not.toThrowError(Error, "error message"))
      .toThrowError(ErrorMatchError,
         "Expected an error with message \"error message\" and type Error to not have been thrown, but it was.");
   }

   @Test()
   public noErrorThrownWhenNoneExpectedPasses() {
      const nonThrowFunction = () => {};

      Expect(() => Expect(nonThrowFunction).not.toThrowError(Error, "error message"))
      .not.toThrow();
   }

   @Test()
   public differentErrorThrownWhenNoneExpectedPasses() {
      const throwWrongErrorFunction = () => { throw new RangeError("another message"); };

      Expect(() => Expect(throwWrongErrorFunction).not.toThrowError(Error, "error message"))
      .not.toThrow();
   }

   @Test()
   public differentTypeErrorThrownWhenNoneExpectedPasses() {
      const throwWrongTypeFunction = () => { throw new RangeError("error message"); };

      Expect(() => Expect(throwWrongTypeFunction).not.toThrowError(TypeError, "error message"))
      .not.toThrow();
   }

   @Test()
   public differentMessageErrorThrownWhenNoneExpectedPasses() {
      const throwWrongMessageFunction = () => { throw new Error("another message"); };

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
      const EXPECT = Expect(() => {});
      (EXPECT as any)._actualValue = actualValue;

      Expect(() => EXPECT.toThrowError(Error, ""))
            .toThrowError(TypeError, "toThrowError requires value passed in to Expect to be a function.");
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
      const EXPECT = Expect(() => {});
      (EXPECT as any)._actualValue = actualValue;

      Expect(() => EXPECT.not.toThrowError(Error, ""))
            .toThrowError(TypeError, "toThrowError requires value passed in to Expect to be a function.");
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
   public actualValueAndShouldMatchAndExpectedErrorShouldBeSetToErrorWasNotThrown(
                                                                  expectedErrorType: new (message: string) => Error,
                                                                  expectedErrorMessage: string) {

      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { }).toThrowError(expectedErrorType, expectedErrorMessage);
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
   public actualValueAndShouldMatchAndExpectedErrorShouldBeSetToWrongErrorWasThrown(
                                                                  expectedErrorType: new (message: string) => Error,
                                                                  expectedErrorMessage: string,
                                                                  actualErrorType: new (message: string) => Error,
                                                                  actualErrorMessage: string) {
      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { throw new actualErrorType(actualErrorMessage); })
            .toThrowError(expectedErrorType, expectedErrorMessage);
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.actual)
            .toBe(`${(actualErrorType as INameable).name} error was thrown with message "${actualErrorMessage}".`);
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public actualValueAndShouldNotMatchAndExpectedErrorShouldBeSetToWrongErrorWasThrown(
                                                            expectedErrorType: new (message: string) => Error,
                                                            expectedErrorMessage: string) {
      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { throw new expectedErrorType(expectedErrorMessage); })
            .not.toThrowError(expectedErrorType, expectedErrorMessage);
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.actual)
            .toBe(`${(expectedErrorType as INameable).name} error was thrown with message "${expectedErrorMessage}".`);
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public expectedValueAndShouldMatchShouldBeSetToErrorShouldBeThrown(
                                                            expectedErrorType: new (message: string) => Error,
                                                            expectedErrorMessage: string) {
      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { }).toThrowError(expectedErrorType, expectedErrorMessage);
      }
      catch (error) {
         errorMatchError = error;
      }

      const errorName = (expectedErrorType as INameable).name;

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.expected)
            .toBe(`${ errorName } error to be thrown with message "${expectedErrorMessage}".`);
   }

   @TestCase(EvalError, "something went wrong")
   @TestCase(ReferenceError, "A much worse thing happened!")
   @TestCase(SyntaxError, "THE END IS NIGH")
   public expectedValueAndShouldNotMatchShouldBeSetToErrorShouldNotBeThrown(
                                                      expectedErrorType: new (message: string) => Error,
                                                      expectedErrorMessage: string) {
      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { throw new expectedErrorType(expectedErrorMessage); })
            .not.toThrowError(expectedErrorType, expectedErrorMessage);
      }
      catch (error) {
         errorMatchError = error;
      }

      const errorName = (expectedErrorType as INameable).name;

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.expected)
            .toBe(`${ errorName } error not to be thrown with message "${expectedErrorMessage}".`);
   }
}
