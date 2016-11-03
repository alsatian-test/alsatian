import { FunctionSpy } from "../_spying";
import { FunctionCallCountMatchError } from "../_errors";

export class FunctionSpyCallCountMatcher {

   public constructor(spy: FunctionSpy, expectedCallCount: number) {
      if (spy.calls.length !== expectedCallCount) {
         throw new FunctionCallCountMatchError(spy, true, expectedCallCount);
      }
   }

   public get times(): undefined {
      return undefined;
   }
}
