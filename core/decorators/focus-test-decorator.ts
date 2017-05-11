import "reflect-metadata";
import { FOCUS } from "./_metadata-keys";

export function FocusTest(target: object, propertyKey: string, descriptor?: TypedPropertyDescriptor<any>) {
    descriptor = undefined; // Unused

    // mark test method as focussed
    Reflect.defineMetadata(FOCUS, true, target, propertyKey);
}
