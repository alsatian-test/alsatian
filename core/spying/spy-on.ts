import { RestorableFunctionSpy } from "../spying";

export function SpyOn<T>(
  target: T,
  functionName: keyof T
): RestorableFunctionSpy {
  if (target[functionName] instanceof Function) {
    return new RestorableFunctionSpy(target, functionName as any);
  } else {
    throw new TypeError(`${functionName} is not a function.`);
  }
}
