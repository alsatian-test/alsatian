import { FunctionSpy } from "../_spying";
import { FunctionCallCountMatchError } from "../_errors";
import { SpyCallCountType } from "./";

export class FunctionSpyCallCountMatcher {

   public constructor(spy: FunctionSpy, expectedCallCount: number, countType: SpyCallCountType, shouldMatch: boolean) {
      if (countType === SpyCallCountType.Exactly && spy.calls.length !== expectedCallCount === shouldMatch) {
         throw new FunctionCallCountMatchError(spy, shouldMatch, expectedCallCount, countType);
      }
      else if (countType === SpyCallCountType.GreaterThan && spy.calls.length <= expectedCallCount) {
         throw new FunctionCallCountMatchError(spy, shouldMatch, expectedCallCount, countType);
      }
   }

   public get times(): undefined {
      return undefined;
   }
}
