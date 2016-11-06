import { FunctionSpy } from "../_spying";
import { FunctionSpyCallCountMatcher, SpyCallCountType } from "./";

export class FunctionSpyMatcher {

   private _spy: FunctionSpy;

   public constructor(spy: FunctionSpy, expectedArguments?: Array<any>) {
      if (spy === null || spy === undefined) {
         throw new TypeError("spy must not be null or undefined.");
      }

      this._spy = spy;
   }

   public exactly(expectedCallCount: number): FunctionSpyCallCountMatcher {

      if (expectedCallCount < 1) {
         throw new TypeError("expectedCallCount must be greater than 0.");
      }

      return new FunctionSpyCallCountMatcher(this._spy, expectedCallCount, SpyCallCountType.Exactly, true);
   }

   public anythingBut(expectedCallCount: number): FunctionSpyCallCountMatcher {
      return new FunctionSpyCallCountMatcher(this._spy, expectedCallCount, SpyCallCountType.Exactly, false);
   }

   public greaterThan(expectedCallLowerLimit: number): FunctionSpyCallCountMatcher {
      return new FunctionSpyCallCountMatcher(this._spy, expectedCallLowerLimit, SpyCallCountType.GreaterThan, true);
   }

   public lessThan(expectedCallUpperLimit: number): FunctionSpyCallCountMatcher {
      return new FunctionSpyCallCountMatcher(this._spy, expectedCallUpperLimit, SpyCallCountType.LessThan, true);
   }
}
