import { ErrorMatchError } from "../../../core/errors/error-match-error";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

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
    let throwFunction = () => { throw new Error("error message") };

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
    let throwFunction = () => { throw new Error("error message") };

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
}
