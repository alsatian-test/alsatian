import { MatchError } from "../_errors";

export class GreaterThanMatchError extends MatchError {

   public constructor(actualValue: number, lowerLimit: number, shouldMatch: boolean) {
      super(`Expected ${actualValue} ${!shouldMatch ? "not " : ""}to be greater than ${lowerLimit}.`);

      this._actual = actualValue;
      this._expected = `a number ${shouldMatch ? "" : "not "}greater than ${lowerLimit}`;
   }
}
