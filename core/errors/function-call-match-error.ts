import { MatchError } from "../_errors";

export class FunctionCallMatchError extends MatchError {

  public constructor(actualValue: any, shouldMatch: boolean, args?: Array<any>) {
    // rework expected / actual values
    super(`function was ${shouldMatch ? "not " : ""}called.`, `function ${!shouldMatch ? "not " : ""}to be called.`, `Expected function ${!shouldMatch ? "not " : ""}to be called${args ? " with [" + args.map(arg => JSON.stringify(arg)).join(", ") + "]" : ""}.`);
  }
}
