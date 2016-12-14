import { MatchError } from "../errors";
import { FunctionSpy, Any, TypeMatcher } from "../spying";
import { SpyCallCountType } from "../matchers";

export class FunctionCallCountMatchError extends MatchError {

  public constructor(actualValue: FunctionSpy, shouldMatch: boolean, expectedCallCount: number, countType: SpyCallCountType, args?: Array<any>) {

    super(FunctionCallCountMatchError._buildActualValue(actualValue, args),
          FunctionCallCountMatchError._buildExpectedValue(shouldMatch, expectedCallCount, countType, args),
          FunctionCallCountMatchError._bulidMessage(shouldMatch, expectedCallCount, countType, args));
  }

  private static _bulidMessage(shouldMatch: boolean, expectedCallCount: number, countType: SpyCallCountType, args?: Array<any>) {
    return `Expected function ${!shouldMatch ? "not " : ""}to be called${args ? " with " + FunctionCallCountMatchError._stringifyArguments(args) : ""}${countType === SpyCallCountType.GreaterThan ? " greater than" : ""}${countType === SpyCallCountType.LessThan ? " less than" : ""} ${expectedCallCount} time${expectedCallCount === 1 ? "" : "s"}.`;
  }

  private static _buildExpectedValue(shouldMatch: boolean, expectedCallCount: number, countType: SpyCallCountType, args?: Array<any>) {
    return `function ${!shouldMatch ? "not " : ""}to be called${args ? " with " + FunctionCallCountMatchError._stringifyArguments(args) : ""}${countType === SpyCallCountType.GreaterThan ? " greater than" : ""}${countType === SpyCallCountType.LessThan ? " less than" : ""} ${expectedCallCount} time${expectedCallCount === 1 ? "" : "s"}.`;
  }

  private static _buildActualValue(actualValue: FunctionSpy, args?: Array<any>) {
    return `function was called${args && actualValue.calls.length ? " with " + actualValue.calls.map(call => JSON.stringify(call.args)).join(", ") : ""} ${actualValue.calls.length} time${actualValue.calls.length === 1 ? "" : "s"}.`;
  }

  private static _stringifyArguments(args: Array<any>): string {

     return `[${args.map(arg => {
               if (arg === Any) {
                  return "Anything";
               }
               else if (arg instanceof TypeMatcher) {
                  return "Any " + (<any>arg.type).name;
               }
               else {
                  return JSON.stringify(arg);
               }
            }).join(", ")}]`;

 }
}
