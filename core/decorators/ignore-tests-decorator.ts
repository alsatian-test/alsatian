import "reflect-metadata";
import { IGNORE, IGNORE_REASON } from "./_metadata-keys";
import { Constructor } from "../_interfaces";

export function IgnoreTests(reason?: string) {
    return (constructor: Constructor) => {
        // mark test class as ignored
        Reflect.defineMetadata(IGNORE, true, constructor);
        Reflect.defineMetadata(IGNORE_REASON, reason, constructor);
    };
}
