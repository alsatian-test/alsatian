import { FunctionSpy } from "../_spying";
import { FunctionCallCountMatchError } from "../_errors";
import { SpyCallCountType } from "./";

export class FunctionSpyCallCountMatcher {

   public constructor(spy: FunctionSpy, expectedCallCount: number, countType: SpyCallCountType, shouldMatch: boolean) {
      if (spy.calls.length !== expectedCallCount === shouldMatch) {
         throw new FunctionCallCountMatchError(spy, shouldMatch, expectedCallCount);
      }
   }

   public get times(): undefined {
      return undefined;
   }
}
