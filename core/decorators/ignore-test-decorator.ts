import "reflect-metadata";
import { IGNORE, IGNORE_REASON } from "./_metadata-keys";

export function IgnoreTest(reason?: string) {
    return (target: object, propertyKey: string, descriptor?: TypedPropertyDescriptor<any>) => {
        descriptor = undefined; // Unused

        // mark test method as ignored
        Reflect.defineMetadata(IGNORE, true, target, propertyKey);

        // add the reason
        Reflect.defineMetadata(IGNORE_REASON, reason, target, propertyKey);
    };
}
