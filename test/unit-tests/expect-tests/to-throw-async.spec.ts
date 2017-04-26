import { AsyncTest, Expect, TestCase } from "../../../core/alsatian-core";
import { ErrorMatchError } from "../../../core/errors/error-match-error";

export class ToThrowAsyncTests {
   // Asynchronous throw
   private async asyncThrowFunction(delayMs: number): Promise<void> {
      return new Promise<void>((_, reject) => {
         setTimeout(reject(new Error("Timeout then reject")), delayMs);
      });
   }

   // Asynchronous non-throw
   private async asyncNonThrowFunction(delayMs: number): Promise<void> {
      return new Promise<void>((resolve) => {
         setTimeout(resolve(), delayMs);
      });
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest()
   public async asyncFunctionThrowsErrorPasses(delayMs: number) {
      // Exect to and error NOT be thrown
      await Expect(async() => {
         // Expect an error to be thrown
         await Expect(async () => this.asyncThrowFunction(delayMs)).toThrowAsync();
      }).not.toThrowAsync();
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest()
   public async asyncFunctionThrowDoesNotErrorFails(delayMs: number) {
      // Expect a failure to be thrown
      await Expect(async () => {
         // invoking asyncNonThrowError but expect toThrowAsync so it will fail
         await Expect(() => this.asyncNonThrowFunction(delayMs)).toThrowAsync();
      }).toThrowAsync();
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest()
   public async asyncFunctionDoesNotThrowErrorFailsWithCorrectError(delayMs: number) {
      await Expect(async () => {
         await Expect(() => this.asyncNonThrowFunction(delayMs)).toThrowAsync();
      }).toThrowErrorAsync(ErrorMatchError, "Expected an error to be thrown but no errors were thrown.");
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest()
   public async asyncFunctionDoesNotThrowErrorPassesWhenShouldNotThrow(delayMs: number) {
      await Expect(async () => {
         await Expect(() => this.asyncNonThrowFunction(delayMs)).not.toThrowAsync();
      }).not.toThrowAsync();
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest()
   public async asyncFunctionThrowsErrorFailsWhenShouldNotThrow(delayMs: number) {
      await Expect(async () => {
         await Expect(() => this.asyncThrowFunction(delayMs)).not.toThrowAsync();
      }).toThrowAsync();
   }

   @TestCase(0)
   @TestCase(100)
   @AsyncTest()
   public async asyncFunctionThrowsErrorFailsWithCorrectError(delayMs: number) {
      await Expect(async () => {
         await Expect(() => this.asyncThrowFunction(delayMs)).not.toThrowAsync();
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
   @AsyncTest()
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
   @AsyncTest()
   public async asyncCheckingWhetherNonFunctionDoesNotThrowShouldThrow(actualValue: any) {
      await Expect(async () => {
         await Expect(actualValue).not.toThrowAsync();
      }).toThrowErrorAsync(TypeError, "toThrowAsync requires value passed in to Expect to be a function.");
   }

   @AsyncTest()
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

   @AsyncTest()
   public async asyncActualValueAndShouldMatchShouldBeSetToErrorToBeThrown() {

      let errorMatchError: ErrorMatchError;

      try {
         await Expect(() => {}).toThrowAsync();
      }
      catch (error) {
         errorMatchError = error;
      }

      Expect(errorMatchError).toBeDefined();
      Expect(errorMatchError).not.toBeNull();
      Expect(errorMatchError.expected).toBe("error to be thrown.");
   }

   @AsyncTest()
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

   @AsyncTest()
   public async asyncCheckingToThrowErrorAsyncPassesWhenErrorsMatch() {

      await Expect(async () => {
         await Expect(() => { throw new EvalError("An EvalError"); }).toThrowErrorAsync(EvalError, "An EvalError");
      }).toBeTruthy();
   }

   @AsyncTest()
   public async asyncCheckingToThrowErrorAsyncFailsOnWhenErrorsDoNotMatch() {

      await Expect(async () => {
         await Expect(() => {
            throw new EvalError("An EvalError");
         }).toThrowErrorAsync(SyntaxError, "An SyntaxError");
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
   @AsyncTest()
   public async asyncCheckingWhetherNonFunctionForToThrowErrorAcyncDoesThrow(actualValue: any) {
      await Expect(async () => {
         await Expect(actualValue)
            .toThrowErrorAsync(TypeError, "toThrowAsync requires value passed to Expect to be a function.");
      }).toThrowAsync();
   }

}
