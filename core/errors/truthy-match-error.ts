import { MatchError } from "./match-error";
import { stringify } from "../stringification";

export class TruthyMatchError extends MatchError {

  public constructor(actualValue: any, shouldMatch: boolean) {
    super(`Expected ${stringify(actualValue)} ${!shouldMatch ? "not " : ""}to be truthy.`);

    this._actual = actualValue;
    this._expected = `${shouldMatch ? "truthy" : "falsy"}`;
  }
}
