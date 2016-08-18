import "reflect-metadata";
import { IGNORE, IGNORE_REASON } from "./_metadata-keys";

export function IgnoreTests(reason?: string) {
    return (constructor: Function) => {
        // mark test class as ignored
        Reflect.defineMetadata(IGNORE, true, constructor);
        Reflect.defineMetadata(IGNORE_REASON, reason, constructor);
    };
}
