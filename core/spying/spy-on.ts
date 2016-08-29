import { RestorableSpy } from "../_spying";

export function SpyOn(target: any, functionName: string): RestorableSpy {

   if (target[functionName] instanceof Function) {
      return new RestorableSpy(target, functionName);
   }
   else {
      throw new TypeError(`${functionName} is not a function.`);
   }
}
