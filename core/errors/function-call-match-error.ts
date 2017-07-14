import { Any, FunctionSpy, TypeMatcher } from "../spying";
import { MatchError } from "./match-error";
import { stringify } from "../stringification";

export class FunctionCallMatchError extends MatchError {

  public constructor(actualValue: FunctionSpy, shouldMatch: boolean, args?: Array<any>) {

    super(
    `Expected function ${!shouldMatch ? "not " : ""}to be called` +
    `${args ? " with " + stringify(args) : ""}.`);

    const calls = actualValue.calls;

    this._actual = `function was ${shouldMatch && !(args && calls.length) ? "not " : ""}called` +
    `${args && calls.length ? " with " + calls.map(call => stringify(call.args)).join(", ") : ""}.`;

    this._expected =
    `function ${!shouldMatch ? "not " : ""}to be called` +
    `${args ? " with " + stringify(args) : ""}.`;
  }
}
