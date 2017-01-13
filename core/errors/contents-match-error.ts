import { MatchError } from "../errors";
import { ArgumentStringifier } from "../stringification";

export class ContentsMatchError extends MatchError {

  private _argumentStringifier = new ArgumentStringifier();

   public constructor(actualValue: any, expectedContent: any, shouldMatch: boolean) {
      super();

      this.message = `Expected ${this._argumentStringifier.stringify(actualValue)} ${!shouldMatch ? "not " : ""}` +
                     `to contain ${this._argumentStringifier.stringify(expectedContent)}.`;

      this._actual = actualValue;
      this._expected = expectedContent;
   }
}
