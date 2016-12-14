import { MatchError } from "../errors";

export class LessThanMatchError extends MatchError {

   public constructor(actualValue: number, upperLimit: number, shouldMatch: boolean) {
      super(actualValue, `a number ${shouldMatch ? "" : "not "}less than ${upperLimit}`, `Expected ${actualValue} ${!shouldMatch ? "not " : ""}to be less than ${upperLimit}.`);
   }
}
