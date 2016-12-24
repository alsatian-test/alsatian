import { MatchError } from "../errors";

export class ContentsMatchError extends MatchError {

   public constructor(actualValue: any, expectedContent: any, shouldMatch: boolean) {
      super(`Expected ${JSON.stringify(actualValue)} ${!shouldMatch ? "not " : ""}to contain ${JSON.stringify(expectedContent)}.`);

      this._actual = actualValue;
      this._expected = expectedContent;
   }
}
