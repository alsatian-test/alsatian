import { MatchError } from "../_errors";
import { FunctionSpy, Any, TypeMatcher } from "../_spying";
import { SpyCallCountType } from "../matchers";

export class FunctionCallCountMatchError extends MatchError {

  public constructor(actualValue: FunctionSpy, shouldMatch: boolean, expectedCallCount: number, countType: SpyCallCountType, args?: Array<any>) {

    super(`function was called${args && actualValue.calls.length ? " with " + actualValue.calls.map(call => JSON.stringify(call.args)).join(", ") : ""} ${actualValue.calls.length} time${actualValue.calls.length === 1 ? "" : "s"}.`,
          `function ${!shouldMatch ? "not " : ""}to be called${args ? " with " + FunctionCallCountMatchError._stringifyArguments(args) : ""}${countType === SpyCallCountType.GreaterThan ? " greater than" : ""}${countType === SpyCallCountType.LessThan ? " less than" : ""} ${expectedCallCount} time${expectedCallCount === 1 ? "" : "s"}.`,
          `Expected function ${!shouldMatch ? "not " : ""}to be called${args ? " with " + FunctionCallCountMatchError._stringifyArguments(args) : ""}${countType === SpyCallCountType.GreaterThan ? " greater than" : ""}${countType === SpyCallCountType.LessThan ? " less than" : ""} ${expectedCallCount} time${expectedCallCount === 1 ? "" : "s"}.`);
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
