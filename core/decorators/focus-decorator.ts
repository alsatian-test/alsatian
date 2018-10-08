import { FOCUS } from "./_metadata-keys";

export function Focus<T>(reason: string) {
    return (target: T | (new (...args: Array<any>) => T), propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<T>) => {
        if (typeof target === "function") {
            // mark test method as focussed
            Reflect.defineMetadata(FOCUS, true, target);
        }
        else {
            // mark test method as focussed
            Reflect.defineMetadata(FOCUS, true, target, propertyKey);
        }
    }
}
