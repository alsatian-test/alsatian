import "reflect-metadata";
import { IGNORE, IGNORE_REASON } from "./_metadata-keys";
import { Constructor } from "../_interfaces";
import { deprecate } from "../maintenance/deprecate";

export function IgnoreTests(reason?: string) {
  deprecate("IgnoreTests", "4.0.0", "Use the Ignore decorator instead.");

  return (constructor: Constructor) => {
    // mark test class as ignored
    Reflect.defineMetadata(IGNORE, true, constructor);
    Reflect.defineMetadata(IGNORE_REASON, reason, constructor);
  };
}
