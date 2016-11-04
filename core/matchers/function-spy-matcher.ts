import { FunctionSpy } from "../_spying";
import { FunctionSpyCallCountMatcher, SpyCallCountType } from "./";

export class FunctionSpyMatcher {

   private _spy: FunctionSpy;
   private _shouldMatch: boolean;

   public constructor(spy: FunctionSpy, shouldMatch: boolean, expectedArguments?: Array<any>) {
      if (spy === null || spy === undefined) {
         throw new TypeError("spy must not be null or undefined.");
      }

      this._spy = spy;
      this._shouldMatch = shouldMatch;
   }

   public exactly(expectedCallCount: number): FunctionSpyCallCountMatcher {
      return new FunctionSpyCallCountMatcher(this._spy, expectedCallCount, SpyCallCountType.Exactly, this._shouldMatch);
   }

   public greaterThan(expectedCallLowerLimit: number): FunctionSpyCallCountMatcher {
      return new FunctionSpyCallCountMatcher(this._spy, expectedCallLowerLimit, SpyCallCountType.GreaterThan, this._shouldMatch);
   }

   public lessThan(expectedCallUpperLimit: number): FunctionSpyCallCountMatcher {
      return new FunctionSpyCallCountMatcher(this._spy, expectedCallUpperLimit, SpyCallCountType.LessThan, this._shouldMatch);
   }
}
