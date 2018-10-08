import "reflect-metadata";
import { IGNORE, IGNORE_REASON } from "./_metadata-keys";
import { Unused } from "../unused";
import { deprecate } from "../maintenance/deprecate";

export function IgnoreTest(reason?: string) {
  return ((
    target: object,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    Unused(descriptor);

    deprecate("IgnoreTest", "4.0.0", "Use the Ignore decorator instead.");

    // mark test method as ignored
    Reflect.defineMetadata(IGNORE, true, target, propertyKey);

    // add the reason
    Reflect.defineMetadata(IGNORE_REASON, reason, target, propertyKey);
  });
}
