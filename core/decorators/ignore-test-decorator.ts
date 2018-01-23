import "reflect-metadata";
import { IGNORE, IGNORE_REASON } from "./_metadata-keys";
import { Unused } from "../unused";

export function IgnoreTest(reason?: string) {
  return (
    target: object,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    Unused(descriptor);

    // mark test method as ignored
    Reflect.defineMetadata(IGNORE, true, target, propertyKey);

    // add the reason
    Reflect.defineMetadata(IGNORE_REASON, reason, target, propertyKey);
  };
}
