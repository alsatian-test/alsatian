import { FunctionCallCountMatchError } from "../errors";
import { FunctionSpy } from "../spying";
import { FunctionSpyCallCountMatcher, SpyCallCountType } from "./";

export class FunctionSpyMatcher {

   private _spy: FunctionSpy;
   private _expectedArguments: Array<any> | null = null;

   public constructor(spy: FunctionSpy, expectedArguments?: Array<any>) {
      if (spy === null || spy === undefined) {
         throw new TypeError("spy must not be null or undefined.");
      }

      if (expectedArguments) {
         this._expectedArguments = expectedArguments;
      }

      this._spy = spy;
   }

   public exactly(expectedCallCount: number): FunctionSpyCallCountMatcher {

    this._validateCallCount(expectedCallCount, "expectedCallCount");
    
    this._throwCallCountError(count => count !== expectedCallCount, expectedCallCount, SpyCallCountType.Exactly, true);

    return new FunctionSpyCallCountMatcher();
   }

   public anythingBut(unexpectedCallCount: number): FunctionSpyCallCountMatcher {

    this._validateCallCount(unexpectedCallCount, "unexpectedCallCount");

    this._throwCallCountError(count => count === unexpectedCallCount, unexpectedCallCount, SpyCallCountType.Exactly, false);

    return new FunctionSpyCallCountMatcher();
   }

   public greaterThan(minimumCallCount: number): FunctionSpyCallCountMatcher {

    this._validateCallCount(minimumCallCount, "minimumCallCount");

    this._throwCallCountError(count => count <= minimumCallCount, minimumCallCount, SpyCallCountType.GreaterThan, true);

    return new FunctionSpyCallCountMatcher();
   }

   public lessThan(maximumCallCount: number): FunctionSpyCallCountMatcher {

      this._validateCallCount(maximumCallCount, "maximumCallCount");

      this._throwCallCountError(count => count >= maximumCallCount, maximumCallCount, SpyCallCountType.LessThan, true);

      return new FunctionSpyCallCountMatcher();
   }

   private _validateCallCount(callCount: number, callCountName: string) {
    if (callCount < 1) {
        throw new TypeError(`${callCountName} must be greater than 0.`);
     }
   }

   private _matchingCallsCount() {
       if (this._expectedArguments === null) {
           return this._spy.calls.length;
       }
       
       return this._matchingArguments();
   }

   private _matchingArguments() {
       if (this._expectedArguments === null) {
           return;
       }

       return this._spy.callsWithArguments.apply(this._spy, this._expectedArguments).length;
   }

   private _throwCallCountError(countIsNotCorrect: (count: number) => boolean, callCount: number, callCountType: SpyCallCountType, shouldMatch: boolean) {
    if (countIsNotCorrect(callCount)) {
        throw new FunctionCallCountMatchError(
            this._spy,
            shouldMatch,
            callCount,
            callCountType,        
            this._expectedArguments
        );
    }
   }
}
