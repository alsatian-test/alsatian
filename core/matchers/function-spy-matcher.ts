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

      if (this._matchingArguments() !== expectedCallCount) {
         
        this._throwCallCountError(expectedCallCount, SpyCallCountType.Exactly, true);
      }
      else if (this._spy.calls.length !== expectedCallCount) {
         throw new FunctionCallCountMatchError(this._spy, true, expectedCallCount, SpyCallCountType.Exactly);
      }

      return new FunctionSpyCallCountMatcher();
   }

   public anythingBut(unexpectedCallCount: number): FunctionSpyCallCountMatcher {

    this._validateCallCount(unexpectedCallCount, "unexpectedCallCount");

      if (this._matchingArguments() === unexpectedCallCount) {
         
        this._throwCallCountError(unexpectedCallCount, SpyCallCountType.Exactly, false);
      }
      else if (this._spy.calls.length === unexpectedCallCount) {
         throw new FunctionCallCountMatchError(this._spy, false, unexpectedCallCount, SpyCallCountType.Exactly);
      }

      return new FunctionSpyCallCountMatcher();
   }

   public greaterThan(minimumCallCount: number): FunctionSpyCallCountMatcher {

    this._validateCallCount(minimumCallCount, "minimumCallCount");

      if (this._matchingArguments() <= minimumCallCount) {          
         this._throwCallCountError(minimumCallCount, SpyCallCountType.GreaterThan, true);
      }
      else if (this._spy.calls.length <= minimumCallCount) {
         throw new FunctionCallCountMatchError(this._spy, true, minimumCallCount, SpyCallCountType.GreaterThan);
      }

      return new FunctionSpyCallCountMatcher();
   }

   public lessThan(maximumCallCount: number): FunctionSpyCallCountMatcher {

      this._validateCallCount(maximumCallCount, "maximumCallCount");

      if (this._matchingArguments() >= maximumCallCount) {
         this._throwCallCountError(maximumCallCount, SpyCallCountType.LessThan, true);
      }
      else if (this._spy.calls.length >= maximumCallCount) {
         throw new FunctionCallCountMatchError(this._spy, true, maximumCallCount, SpyCallCountType.LessThan);
      }

      return new FunctionSpyCallCountMatcher();
   }

   private _getArgumentsMatching(expectedArguments: Array<any>) {
       return this._spy.callsWithArguments.apply(this._spy, expectedArguments);
   }

   private _validateCallCount(callCount: number, callCountName: string) {
    if (callCount < 1) {
        throw new TypeError(`${callCountName} must be greater than 0.`);
     }
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
