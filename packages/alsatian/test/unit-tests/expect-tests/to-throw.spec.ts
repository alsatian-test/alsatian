import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { ErrorMatchError } from "../../../core/errors/error-match-error";
import { INameable } from "../../../core/_interfaces";

export class ToThrowTests {
  @Test()
  public functionThrowsErrorPasses() {
    const throwFunction = () => {
      throw new Error();
    };

    Expect(() => Expect(throwFunction).toThrow()).not.toThrow();
  }

  @Test()
  public functionDoesNotThrowErrorFails() {
    const nonThrowFunction = () => {};

    Expect(() => Expect(nonThrowFunction).toThrow()).toThrow();
  }

  @Test()
  public functionDoesNotThrowErrorFailsWithCorrectError() {
    const nonThrowFunction = () => {};

    Expect(() => Expect(nonThrowFunction).toThrow()).toThrowError(
      ErrorMatchError,
      "Expected an error to be thrown but no errors were thrown."
    );
  }

  @Test()
  public functionDoesNotThrowErrorPassesWhenShouldNotThrow() {
    const nonThrowFunction = () => {};

    Expect(() => Expect(nonThrowFunction).not.toThrow()).not.toThrow();
  }

  @Test()
  public functionThrowsErrorFailsWhenShouldNotThrow() {
    const throwFunction = () => {
      throw new Error();
    };

    Expect(() => Expect(throwFunction).not.toThrow()).toThrow();
  }

  @Test()
  public functionThrowsErrorFailsWithCorrectError() {
    const throwFunction = () => {
      throw new Error();
    };

    Expect(() => Expect(throwFunction).not.toThrow()).toThrowError(
      ErrorMatchError,
      "Expected an error not to be thrown but an error was thrown."
    );
  }

  @Test()
  public actualValueAndShouldMatchShouldBeSetToErrorWasNotThrown() {
    let errorMatchError: ErrorMatchError;

    try {
      Expect(() => {}).toThrow();
    } catch (error) {
      errorMatchError = error;
    }

    Expect(errorMatchError).toBeDefined();
    Expect(errorMatchError).not.toBeNull();
    Expect(errorMatchError.actual).toBe("error was not thrown.");
  }

  @TestCase(EvalError, "something went wrong")
  @TestCase(ReferenceError, "A much worse thing happened!")
  @TestCase(SyntaxError, "THE END IS NIGH")
  public actualValueAndShouldNotMatchShouldBeSetToErrorWasThrown(
    actualErrorType: new (message: string) => Error,
    actualErrorMessage: string
  ) {
    let errorMatchError: ErrorMatchError;

    try {
      Expect(() => {
        throw new actualErrorType(actualErrorMessage);
      }).not.toThrow();
    } catch (error) {
      errorMatchError = error;
    }

    Expect(errorMatchError).toBeDefined();
    Expect(errorMatchError).not.toBeNull();
    Expect(errorMatchError.actual).toBe(
      `${
        (actualErrorType as INameable).name
      } error was thrown with message "${actualErrorMessage}".`
    );
  }

  @Test()
  public actualValueAndShouldMatchShouldBeSetToErrorToBeThrown() {
    let errorMatchError: ErrorMatchError;

    try {
      Expect(() => {}).toThrow();
    } catch (error) {
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
      Expect(() => {
        throw new Error();
      }).not.toThrow();
    } catch (error) {
      errorMatchError = error;
    }

    Expect(errorMatchError).toBeDefined();
    Expect(errorMatchError).not.toBeNull();
    Expect(errorMatchError.expected).toBe("error not to be thrown.");
  }
}
