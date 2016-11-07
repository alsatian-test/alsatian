import { Any, TypeMatcher } from "../_spying";

export class SpyCall {

   private _args: Array<any> = [];
   public get args() {
      return this._args;
   }

   public allArgumentsMatch(... expectedArguments: Array<any>): boolean {
      if (expectedArguments.length !== expectedArguments.length) {
         return false;
      }

      if (expectedArguments.some((arg, index) => !this._argumentIsAsExpected(this._args[index], arg))) {
         return false
      }

      return true;
   }

   private _argumentIsAsExpected(actualArgument: any, expectedArgument: any) {
      if (expectedArgument === Any) {
         return true;
      }
      else if (expectedArgument instanceof TypeMatcher) {
         return expectedArgument.test(actualArgument);
      }

      return actualArgument === expectedArgument;
   }

   public constructor(args: Array<any>) {
      this._args = args;
   }
}
