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

      if (this._matchingCallsCount() !== expectedCallCount) {
        this._throwCallCountError(expectedCallCount, SpyCallCountType.Exactly, true);
      }

      return new FunctionSpyCallCountMatcher();
   }

   public anythingBut(unexpectedCallCount: number): FunctionSpyCallCountMatcher {

    this._validateCallCount(unexpectedCallCount, "unexpectedCallCount");

      if (this._matchingCallsCount() === unexpectedCallCount) {
        this._throwCallCountError(unexpectedCallCount, SpyCallCountType.Exactly, false);
      }

      return new FunctionSpyCallCountMatcher();
   }

   public greaterThan(minimumCallCount: number): FunctionSpyCallCountMatcher {

    this._validateCallCount(minimumCallCount, "minimumCallCount");

      if (this._matchingCallsCount() <= minimumCallCount) {
        this._throwCallCountError(minimumCallCount, SpyCallCountType.GreaterThan, true);
      }

      return new FunctionSpyCallCountMatcher();
   }

   public lessThan(maximumCallCount: number): FunctionSpyCallCountMatcher {

      this._validateCallCount(maximumCallCount, "maximumCallCount");

      if (this._matchingCallsCount() >= maximumCallCount) {
          this._throwCallCountError(maximumCallCount, SpyCallCountType.LessThan, true);
      }

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

   private _throwCallCountError(callCount: number, callCountType: SpyCallCountType, shouldMatch: boolean) {
    throw new FunctionCallCountMatchError(
        this._spy,
        shouldMatch,
        callCount,
        callCountType,        
        this._expectedArguments
    );
   }
}
