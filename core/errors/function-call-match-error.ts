import { MatchError } from "./match-error";

export class FunctionCallMatchError extends MatchError {

  public constructor(actualValue: any, shouldMatch: boolean, args?: Array<any>) {
    super(actualValue, "function to be called", `Expected function ${!shouldMatch ? "not ": ""}to be called${args ? "with [" + args.join(", ") + "]": ""}.`);
  }
}
