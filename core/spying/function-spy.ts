import { SpyCall } from "../_spying";

export class FunctionSpy {

   private _originalFunction: (...args: Array<any>) => any;
   private _returnValue: any;
   private _hasReturnValue: boolean;
   private _isStubbed: boolean;
   private _originalContext: any;
   private _fakeFunction: Function;
   private _functionName: string;
   private _target: any;

   private _calls: Array<SpyCall> = [];
   public get calls() {
     return this._calls;
   }

   public constructor(target: any, functionName: string) {

     this._originalFunction = target[functionName];
     this._originalContext = target;

      this._functionName = functionName;
      this._target = target;

      target[functionName] = this.call.bind(this);

      // expose spy's calls on function
      target[functionName].calls = this.calls;

      // expose spy's restore function
      target[functionName].restore = this.restore.bind(this);
   }

   public restore() {
      this._target[this._functionName] = this._originalFunction;
   }

   public call(...args: Array<any>) {

     this.calls.push(new SpyCall(args));

     let returnValue: any;

     if (!this._isStubbed) {
       returnValue = this._originalFunction.apply(this._originalContext, args);
     }
     else if (this._fakeFunction) {
       returnValue = this._fakeFunction.apply(this._originalContext, args);
     }

     if (this._hasReturnValue) {
       return this._returnValue;
     }

     return returnValue;
   }

   public andReturn(returnValue: any) {
     this._returnValue = returnValue;
     this._hasReturnValue = true;
   }

   public andCallThrough() {
     this._isStubbed = false;
     this._fakeFunction = undefined;
   }

   public andStub() {
     this._isStubbed = true;
     this._fakeFunction = undefined;
   }

   public andCall(fakeFunction: Function) {
     this._isStubbed = true;
     this._fakeFunction = fakeFunction;
   }
}
