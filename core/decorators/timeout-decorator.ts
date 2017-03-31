import "reflect-metadata";
import { TIMEOUT } from "./_metadata-keys";

export function Timeout(timeoutInMs: number) {
  if (timeoutInMs <= 0) {
     throw new RangeError("Timeout period must be greater than 0.");
  }

  return (target: Object, propertyKey: string, descriptor?: TypedPropertyDescriptor<any>) => {

    Reflect.defineMetadata(TIMEOUT, timeoutInMs, target, propertyKey);
  };
}
