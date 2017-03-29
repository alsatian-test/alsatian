import "reflect-metadata";
import { FOCUS } from "./_metadata-keys";

export function FocusTests(constructor: ({ new (...args: Array<any>): any; }) | (() => any)) {

    // mark test class as focussed
    Reflect.defineMetadata(FOCUS, true, constructor);
}
