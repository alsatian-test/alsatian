import "reflect-metadata";
import { IGNORE } from "./_metadata-keys";

export function IgnoreTests(reason?: string) {
    return (constructor: Function) => {
        // mark test class as ignored
        Reflect.defineMetadata(IGNORE, true, constructor);
    };
}
