import { MatchError } from "./match-error";

export class GreaterThanMatchError extends MatchError {

  public constructor(actualValue: number, lowerLimit: number, shouldMatch: boolean) {
    super(actualValue, lowerLimit, `Expected ${actualValue} ${!shouldMatch ? "not ": ""}to be greater than ${lowerLimit}.`);
  }
}
