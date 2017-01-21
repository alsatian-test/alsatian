import { MatchError } from "./match-error";

export class TruthyMatchError extends MatchError {

  public constructor(actualValue: any, shouldMatch: boolean) {
    super(`Expected ${JSON.stringify(actualValue)} ${!shouldMatch ? "not " : ""}to be truthy.`);

    this._actual = actualValue;
    this._expected = `${shouldMatch ? "truthy" : "falsy"}`;
  }
}
