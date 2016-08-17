import "reflect-metadata";
import { IGNORE_KEY } from "./_metadata-keys";

export function IgnoreTests(reason?: string) {
    return (constructor: Function) => {
        // mark test class as ignored
        Reflect.defineMetadata(IGNORE_KEY, true, constructor);
    };
}
