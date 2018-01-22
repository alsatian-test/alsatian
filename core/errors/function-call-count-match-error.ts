import { INameable } from "../_interfaces";
import { SpyCallCountType } from "../matchers";
import { Any, FunctionSpy, TypeMatcher } from "../spying";
import { stringify } from "../stringification";
import { MatchError } from "./match-error";

export class FunctionCallCountMatchError extends MatchError {
  private static _bulidMessage(
    shouldMatch: boolean,
    expectedCallCount: number,
    countType: SpyCallCountType,
    args?: Array<any>
  ) {
    return (
      `Expected function ${!shouldMatch ? "not " : ""}to be called` +
      `${args ? " with " + stringify(args) : ""}` +
      `${countType === SpyCallCountType.GreaterThan ? " greater than" : ""}` +
      `${
        countType === SpyCallCountType.LessThan ? " less than" : ""
      } ${expectedCallCount} time` +
      `${expectedCallCount === 1 ? "" : "s"}.`
    );
  }

  private static _buildExpectedValue(
    shouldMatch: boolean,
    expectedCallCount: number,
    countType: SpyCallCountType,
    args?: Array<any>
  ) {
    return (
      `function ${!shouldMatch ? "not " : ""}to be called` +
      `${args ? " with " + stringify(args) : ""}` +
      `${countType === SpyCallCountType.GreaterThan ? " greater than" : ""}` +
      `${countType === SpyCallCountType.LessThan ? " less than" : ""} ` +
      `${expectedCallCount} time${expectedCallCount === 1 ? "" : "s"}.`
    );
  }

  private static _buildActualValue(
    actualValue: FunctionSpy,
    args?: Array<any>
  ) {
    return (
      `function was called` +
      `${
        args && actualValue.calls.length
          ? " with " +
            actualValue.calls.map(call => stringify(call.args)).join(", ")
          : ""
      } ` +
      `${actualValue.calls.length} time${
        actualValue.calls.length === 1 ? "" : "s"
      }.`
    );
  }

  public constructor(
    actualValue: FunctionSpy,
    shouldMatch: boolean,
    expectedCallCount: number,
    countType: SpyCallCountType,
    args?: Array<any>
  ) {
    super(
      FunctionCallCountMatchError._bulidMessage(
        shouldMatch,
        expectedCallCount,
        countType,
        args
      ),
      FunctionCallCountMatchError._buildExpectedValue(
        shouldMatch,
        expectedCallCount,
        countType,
        args
      ),
      FunctionCallCountMatchError._buildActualValue(actualValue, args)
    );
  }
}
