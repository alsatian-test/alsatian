import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { ErrorMatchError } from "../../../core/errors/error-match-error";

export class ToThrowTests {

   @Test()
   public functionThrowsErrorPasses() {
      let throwFunction = () => { throw new Error(); };

      Expect(() => Expect(throwFunction).toThrow()).not.toThrow();
   }

   @Test()
   public functionDoesNotThrowErrorFails() {
      let nonThrowFunction = () => undefined;

      Expect(() => Expect(nonThrowFunction).toThrow()).toThrow();
   }

   @Test()
   public functionDoesNotThrowErrorFailsWithCorrectError() {
      let nonThrowFunction = () => undefined;

      Expect(() => Expect(nonThrowFunction).toThrow()).toThrowError(ErrorMatchError, "Expected an error to be thrown but no errors were thown.");
   }

   @Test()
   public functionDoesNotThrowErrorPassesWhenShouldNotThrow() {
      let nonThrowFunction = () => undefined;

      Expect(() => Expect(nonThrowFunction).not.toThrow()).not.toThrow();
   }

   @Test()
   public functionThrowsErrorFailsWhenShouldNotThrow() {
      let throwFunction = () => { throw new Error(); };

      Expect(() => Expect(throwFunction).not.toThrow()).toThrow();
   }

   @Test()
   public functionThrowsErrorFailsWithCorrectError() {
      let throwFunction = () => { throw new Error(); };

      Expect(() => Expect(throwFunction).not.toThrow()).toThrowError(ErrorMatchError, "Expected an error not to be thrown but an error was thown.");
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
   public checkingWhetherNonFunctionThrowsShouldThrow(actualValue: any) {
      Expect(() => Expect(actualValue).toThrow()).toThrowError(TypeError, "toThrow requires value passed in to Expect to be a function.");
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
   public checkingWhetherNonFunctionDoesNotThrowShouldThrow(actualValue: any) {
      Expect(() => Expect(actualValue).not.toThrow()).toThrowError(TypeError, "toThrow requires value passed in to Expect to be a function.");
   }

   @Test()
   public actualValueAndShouldMatchShouldBeSetToErrorWasNotThrown() {

      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => undefined).toThrow();
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
   public actualValueAndShouldNotMatchShouldBeSetToErrorWasThrown(ActualErrorType: new (message: string) => Error, actualErrorMessage: string) {

      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { throw new ActualErrorType(actualErrorMessage); }).not.toThrow();
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.actual).toBe(`${(<any>ActualErrorType).name} error was thrown with message "${actualErrorMessage}".`);
   }

   @Test()
   public actualValueAndShouldMatchShouldBeSetToErrorToBeThrown() {

      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => undefined).toThrow();
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.expected).toBe("error to be thrown.");
   }

   @Test()
   public expectedValueAndShouldNotMatchShouldBeSetToErrorNotToBeThrown() {

      let errorMatchError: ErrorMatchError;

      try {
         Expect(() => { throw new Error(); }).not.toThrow();
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.expected).toBe("error not to be thrown.");
   }
}
