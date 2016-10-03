import { MatchError } from "../_errors";
import { FunctionSpy, Any, TypeMatcher } from "../_spying";

export class FunctionCallMatchError extends MatchError {

  public constructor(actualValue: FunctionSpy, shouldMatch: boolean, args?: Array<any>) {

    super(`function was ${shouldMatch && !(args && actualValue.calls.length) ? "not " : ""}called${args && actualValue.calls.length ? " with " + actualValue.calls.map(call => JSON.stringify(call.args)).join(", ") : ""}.`,
          `function ${!shouldMatch ? "not " : ""}to be called${args ? " with " + JSON.stringify(args) : ""}.`,
          `Expected function ${!shouldMatch ? "not " : ""}to be called${args ? " with [" + args.map(arg => {
            if (arg === Any) {
               return "Anything";
            }
            else if (arg instanceof TypeMatcher) {
               return "Any " + arg.type.name;
            }
            else {
               return JSON.stringify(arg);
            }
         }).join(", ") + "]" : ""}.`);
  }
}
