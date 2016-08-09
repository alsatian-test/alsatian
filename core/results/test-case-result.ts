import { TestOutcome } from "./test-outcome";
import { ITest } from "../_interfaces/test.i";
import { MatchError } from "../_errors";

export class TestCaseResult {

   public arguments() {
      return this._arguments;
   }

   get outcome(): TestOutcome {
      if (this._error) {
         if (this._error instanceof MatchError) {
            return TestOutcome.Fail;
         }

         return TestOutcome.Error;
      }

      if (this._test.ignored) {
         return TestOutcome.Skip;
      }

      return TestOutcome.Pass;
   }

   public constructor(private _test: ITest, private _arguments: Array<any>, private _error?: Error) { }
}
