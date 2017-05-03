import { AsyncTest, Expect, TestCase } from "../../../core/alsatian-core";
import { ErrorMatchError } from "../../../core/errors/error-match-error";

export class ToThrowAsyncTests {
   // Asynchronous throw
   private async asyncThrowFunction(delayMs: number): Promise<void> {
      return new Promise<void>((_, reject) => {
         setTimeout(() => reject(new Error("Timeout then reject")), delayMs);
      });
   }

   // Asynchronous non-throw
   private async asyncNonThrowFunction(delayMs: number): Promise<void> {
      return new Promise<void>((resolve) => {
         setTimeout(() => resolve(), delayMs);
      });
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest("Test toThrowAsync catches thrown errors and does not rethrow")
   public async asyncFunctionThrowsErrorPasses(delayMs: number) {
      await Expect(async () => {
         await Expect(async () => await this.asyncThrowFunction(delayMs)).toThrowAsync();
      }).not.toThrowAsync();
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest("Test toThrowAsync throws and error if an error is not thrown")
   public async asyncFunctionThrowDoesNotErrorFails(delayMs: number) {
      await Expect(async () => {
         await Expect(async () => await this.asyncNonThrowFunction(delayMs)).toThrowAsync();
      }).toThrowAsync();
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest("Test toThrowAsync throws a ErrorMatchError and toThrowErrorAsync catches it")
   public async asyncFunctionDoesNotThrowErrorFailsWithCorrectError(delayMs: number) {
      await Expect(async () => {
         await Expect(async () => await this.asyncNonThrowFunction(delayMs)).toThrowAsync();
      }).toThrowErrorAsync(ErrorMatchError, "Expected an error to be thrown but no errors were thrown.");
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest("Test not.toThrowAsync does not throw when it shouldn't")
   public async asyncFunctionDoesNotThrowErrorPassesWhenShouldNotThrow(delayMs: number) {
      await Expect(async () => {
         await Expect(async () => await this.asyncNonThrowFunction(delayMs)).not.toThrowAsync();
      }).not.toThrowAsync();
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest("Test not.toThrowAsync does throw when it should")
   public async asyncFunctionThrowsErrorFailsWhenShouldNotThrow(delayMs: number) {
      await Expect(async () => {
         await Expect(async () => await this.asyncThrowFunction(delayMs)).not.toThrowAsync();
      }).toThrowAsync();
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest("Test not.toThrowAsync thows an ErrorMatchError when it should")
   public async asyncFunctionThrowsErrorFailsWithCorrectError(delayMs: number) {
      await Expect(async () => {
         await Expect(async () => await this.asyncThrowFunction(delayMs)).not.toThrowAsync();
      }).toThrowErrorAsync(ErrorMatchError, "Expected an error not to be thrown but an error was thrown.");
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
   @AsyncTest("Test toThrowAsync throws a TypeError when it should")
   public async asyncCheckingWhetherNonFunctionThrowsShouldThrow(actualValue: any) {
      await Expect(async () => {
         await Expect(actualValue).toThrowAsync();
      }).toThrowErrorAsync(TypeError, "toThrowAsync requires value passed in to Expect to be a function.");
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
   @AsyncTest("Test not.toThrowAsync throws a TypeError when it should")
   public async asyncCheckingWhetherNonFunctionDoesNotThrowShouldThrow(actualValue: any) {
      await Expect(async () => {
         await Expect(actualValue).not.toThrowAsync();
      }).toThrowErrorAsync(TypeError, "toThrowAsync requires value passed in to Expect to be a function.");
   }

   @AsyncTest("Test toThrowAsync errors are caught and error is type ErrorMatchError")
   public async asyncActualValueAndShouldNotMatchErrorM() {

      let errorMatchError: ErrorMatchError;

      try {
         await Expect(() => {}).toThrowAsync();
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
   @AsyncTest("Test not.toThrowAsync errors are caught and error is type ErrorMatchError's")
   public async asyncActualValueAndShouldNotMatchShouldBeSetToErrorWasThrown(
      actualErrorType: new (message: string) => Error, actualErrorMessage: string) {

      let errorMatchError: ErrorMatchError;

      try {
         await Expect(() => { throw new actualErrorType(actualErrorMessage); }).not.toThrowAsync();
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.actual)
         .toBe(`${(<any> actualErrorType).name} error was thrown with message "${actualErrorMessage}".`);
   }

   @AsyncTest("Test not.toThrowAsync error are caught and error is ErrorMatchError")
   public async asyncExpectedValueAndShouldNotMatchShouldBeSetToErrorNotToBeThrown() {

      let errorMatchError: ErrorMatchError;

      try {
         await Expect(() => { throw new Error(); }).not.toThrowAsync();
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.expected).toBe("error not to be thrown.");
   }

   @AsyncTest("Test toThrowErrorAsync catches errors of the correct type and passes")
   public async asyncCheckingToThrowErrorAsyncPassesWhenErrorsMatch() {

      await Expect(async () => {
         await Expect(() => { throw new EvalError("An EvalError"); }).toThrowErrorAsync(EvalError, "An EvalError");
      }).toBeTruthy();
   }

   @AsyncTest("Test toThrowErrorAsync catches errors and if it isn't correct throws an Error")
   public async asyncCheckingToThrowErrorAsyncFailsOnWhenErrorsDoNotMatch() {

      await Expect(async () => {
         await Expect(() => { throw new EvalError("An EvalError"); }).toThrowErrorAsync(SyntaxError, "An SyntaxError");
      }).toThrowAsync();
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
   @AsyncTest("Test toThrowErrorAsync throws a TypeError when it should")
   public async asyncCheckingWhetherNonFunctionForToThrowErrorAcyncDoesThrow(actualValue: any) {
      await Expect(async () => {
         await Expect(actualValue)
            .toThrowErrorAsync(TypeError, "toThrowAsync requires value passed to Expect to be a function.");
      }).toThrowAsync();
   }

}
