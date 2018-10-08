import { FOCUS } from "./_metadata-keys";

export function Focus(target: object | (new (...args: Array<any>) => object), propertyKey?: string | symbol) {
    if (typeof target === "function") {
        // mark test method as focussed
        Reflect.defineMetadata(FOCUS, true, target);
    }
    else {
        // mark test method as focussed
        Reflect.defineMetadata(FOCUS, true, target, propertyKey);
    }
}
