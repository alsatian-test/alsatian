import { MatchError } from "./_namespace";

export class TruthyMatchError extends MatchError {

  public constructor(actualValue: any, shouldMatch: boolean) {
    super(actualValue, true, `Expected ${JSON.stringify(actualValue)} ${!shouldMatch ? "not ": ""}to be truthy.`);
  }
}
