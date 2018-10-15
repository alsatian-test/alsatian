import { RestorableFunctionSpy } from "../spying";

export function SpyOn<ObjectType>(
  target: ObjectType,
  functionName: keyof ObjectType
): RestorableFunctionSpy {
  if (target[functionName] instanceof Function) {
    return new RestorableFunctionSpy(target, functionName as string);
  } else {
    throw new TypeError(`${functionName} is not a function.`);
  }
}
