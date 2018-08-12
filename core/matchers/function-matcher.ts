import { ErrorMatchError, FunctionCallMatchError } from "../errors";
import { Any, FunctionSpy, TypeMatcher } from "../spying";
import { FunctionSpyMatcher } from "./";
import { Matcher } from "./matcher";

/**
 * Checks whether functions have performed as expected
 */
export class FunctionMatcher extends Matcher<FunctionSpy | any> {
  /**
   * Checks that a function throws an error when executed
   */
  public toThrow() {
    let errorThrown: Error | null = null;

    try {
      this.actualValue();
    } catch (error) {
      errorThrown = error;
    }

    if ((errorThrown === null) === this.shouldMatch) {
      throw new ErrorMatchError(errorThrown, this.shouldMatch);
    }
  }

  public async toThrowAsync() {
    let errorThrown: Error | null = null;

    try {
      await this.actualValue();
    } catch (error) {
      errorThrown = error;
    }

    if ((errorThrown === null) === this.shouldMatch) {
      throw new ErrorMatchError(errorThrown, this.shouldMatch);
    }
  }

  /**
   * Checks that a function throws a specific error
   * @param errorType - the type of error that should be thrown
   * @param errorMessage - the message that the error should have
   */
  public toThrowError(
    errorType: new (...args: Array<any>) => Error,
    errorMessage: string
  ) {

    let threwRightError = false;
    let actualError: Error | null = null;

    try {
      this.actualValue();
    } catch (error) {
      actualError = error;

      if (error instanceof errorType && error.message === errorMessage) {
        threwRightError = true;
      }
    }

    if (threwRightError !== this.shouldMatch) {
      throw new ErrorMatchError(
        actualError,
        this.shouldMatch,
        errorType,
        errorMessage
      );
    }
  }

  /**
   * Checks that a function throws a specific error asynchronously
   * @param errorType - the type of error that should be thrown
   * @param errorMessage - the message that the error should have
   */
  public async toThrowErrorAsync(
    errorType: new (...args: Array<any>) => Error,
    errorMessage: string
  ) {
    let threwRightError = false;
    let actualError: Error | null = null;

    try {
      await this.actualValue();
    } catch (error) {
      actualError = error;

      if (error instanceof errorType && error.message === errorMessage) {
        threwRightError = true;
      }
    }

    if (threwRightError !== this.shouldMatch) {
      throw new ErrorMatchError(
        actualError,
        this.shouldMatch,
        errorType,
        errorMessage
      );
    }
  }

  /**
   * Checks that a spy has been called
   */
  public toHaveBeenCalled(): FunctionSpyMatcher {

    if ((this.actualValue.calls.length === 0) === this.shouldMatch) {
      throw new FunctionCallMatchError(this.actualValue, this.shouldMatch);
    }

    return new FunctionSpyMatcher(this.actualValue);
  }

  /**
   * Checks that a spy has been called with the specified arguments
   * @param expectedArguments - a list of arguments that the spy should have been called with
   */
  public toHaveBeenCalledWith(
    ...expectedArguments: Array<any>
  ): FunctionSpyMatcher {
    if (
      this.actualValue.calls.some((call: any) =>
        this._callArgumentsMatch(call, expectedArguments)
      ) !== this.shouldMatch
    ) {
      throw new FunctionCallMatchError(
        this.actualValue,
        this.shouldMatch,
        expectedArguments
      );
    }

    return new FunctionSpyMatcher(this.actualValue, expectedArguments);
  }

  private _callArgumentsMatch(call: any, expectedArguments: Array<any>) {
    if (call.args.length !== expectedArguments.length) {
      return false;
    }

    return call.args.every((arg: any, index: number) => {
      const expectedArgument = expectedArguments[index];

      return (
        arg === expectedArgument ||
        expectedArgument === Any ||
        (expectedArgument instanceof TypeMatcher && expectedArgument.test(arg))
      );
    });
  }
}
