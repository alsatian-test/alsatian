import { ArgumentStringifier } from "../stringification";
import { MatchError } from "./match-error";

export class EmptyMatchError extends MatchError {

   public constructor(actualValue: any, shouldMatch: boolean) {
      super();

      const value = new ArgumentStringifier().stringify(actualValue);

      this.message = `Expected "${value}" ${shouldMatch ? "to be" : "not to be"} empty.`;

      this._actual = actualValue;
   }
}
