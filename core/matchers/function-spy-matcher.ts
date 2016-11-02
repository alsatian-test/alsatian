import { FunctionSpy } from "../_spying";
import { FunctionSpyCallCountMatcher } from "./";

export class FunctionSpyMatcher {

   private _spy: FunctionSpy;

   public constructor(spy: FunctionSpy, shouldMatch: boolean, expectedArguments?: Array<any>) {
      if (spy === null || spy === undefined) {
         throw new TypeError("spy must not be null or undefined.");
      }

      this._spy = spy;
   }

   public exactly(expectedCallCount: number): FunctionSpyCallCountMatcher {
      return new FunctionSpyCallCountMatcher();
   }

   public moreThan(expectedCallLowerLimit: number): FunctionSpyCallCountMatcher {
      return new FunctionSpyCallCountMatcher();
   }

   public lessThan(expectedCallUpperLimit: number): FunctionSpyCallCountMatcher {
      return new FunctionSpyCallCountMatcher();
   }
}
