import { SpyCall } from "../_spying";

export class FunctionSpy {

   protected returnValue: any;
   protected hasReturnValue: boolean;
   protected isStubbed: boolean;
   protected context: any;
   private _fakeFunction: Function;

   private _calls: Array<SpyCall> = [];
   public get calls() {
      return this._calls;
   }

   public callsWithArguments(... args: Array<any>): Array<SpyCall> {
      return this.calls.filter(call => call.allArgumentsMatch(args));
   }

   public call(...args: Array<any>) {

      this.calls.push(new SpyCall(args));

      let returnValue: any;

      if (this._fakeFunction) {
         returnValue = this._fakeFunction.apply(this.context, args);
      }

      if (this.hasReturnValue) {
         return this.returnValue;
      }

      return returnValue;
   }

   public andReturn(returnValue: any) {
      this.returnValue = returnValue;
      this.hasReturnValue = true;
   }

   public andCall(fakeFunction: Function) {
      this.isStubbed = true;
      this._fakeFunction = fakeFunction;
   }
}
