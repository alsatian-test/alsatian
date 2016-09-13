import { FunctionSpy } from "../_spying";

export function SpyOn(target: any, functionName: string): FunctionSpy {

   if (target[functionName] instanceof Function) {
      return new FunctionSpy(target, functionName);
   }
   else {
      throw new TypeError(`${functionName} is not a function.`);
   }
}
