import { MatchError } from "../_errors";
import { FunctionSpy, Any, TypeMatcher } from "../_spying";

export class FunctionCallCountMatchError extends MatchError {

  public constructor(actualValue: FunctionSpy, shouldMatch: boolean, expectedCallCount: number, args?: Array<any>) {

    super(`function was ${shouldMatch && !(args && actualValue.calls.length) ? "not " : ""}called${args && actualValue.calls.length ? " with " + actualValue.calls.map(call => JSON.stringify(call.args)).join(", ") : ""}.`,
          `function ${!shouldMatch ? "not " : ""}to be called${args ? " with " + FunctionCallCountMatchError._stringifyArguments(args) : ""}.`,
          `Expected function ${!shouldMatch ? "not " : ""}to be called${args ? " with " + FunctionCallCountMatchError._stringifyArguments(args) : ""}.`);
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
