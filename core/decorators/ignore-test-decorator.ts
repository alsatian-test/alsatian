import "reflect-metadata";
import { IGNORE_KEY, IGNORE_REASON_KEY } from "./_metadata-keys";

export function IgnoreTest(reason?: string) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        // mark test method as ignored
        Reflect.defineMetadata(IGNORE_KEY, true, target, propertyKey);

        // add the reason
        Reflect.defineMetadata(IGNORE_REASON_KEY, reason, target, propertyKey);
    };
}
