import { RestorableFunctionSpy } from "../spying";

export function SpyOn(target: any, functionName: string): RestorableFunctionSpy {

   if (target[functionName] instanceof Function) {
      return new RestorableFunctionSpy(target, functionName);
   }
   else {
      throw new TypeError(`${functionName} is not a function.`);
   }
}
