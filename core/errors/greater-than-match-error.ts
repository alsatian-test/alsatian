import { MatchError } from "../_errors";

export class GreaterThanMatchError extends MatchError {

   public constructor(actualValue: number, lowerLimit: number, shouldMatch: boolean) {
      super(actualValue, `a number ${shouldMatch ? "" : "not "}greater than ${lowerLimit}`, `Expected ${actualValue} ${!shouldMatch ? "not " : ""}to be greater than ${lowerLimit}.`);
   }
}
