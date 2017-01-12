import { MatchError } from "../errors";
import { Any, FunctionSpy, TypeMatcher } from "../spying";

export class FunctionCallMatchError extends MatchError {

  private static _stringifyArguments(args: Array<any>): string {

     return `[${args.map(arg => {
               if (arg === Any) {
                  return "Anything";
               }
               else if (arg instanceof TypeMatcher) {
                  return "Any " + (<any> arg.type).name;
               }
               else {
                  return JSON.stringify(arg);
               }
            }).join(", ")}]`;

 }

  public constructor(actualValue: FunctionSpy, shouldMatch: boolean, args?: Array<any>) {

    super(
    `Expected function ${!shouldMatch ? "not " : ""}to be called` +
    `${args ? " with " + FunctionCallMatchError._stringifyArguments(args) : ""}.`);

    const calls = actualValue.calls;

    this._actual = `function was ${shouldMatch && !(args && calls.length) ? "not " : ""}called` +
    `${args && calls.length ? " with " + calls.map(call => JSON.stringify(call.args)).join(", ") : ""}.`;

    this._expected =
    `function ${!shouldMatch ? "not " : ""}to be called` +
    `${args ? " with " + FunctionCallMatchError._stringifyArguments(args) : ""}.`;
  }
}
