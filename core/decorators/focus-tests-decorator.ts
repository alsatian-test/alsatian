import "reflect-metadata";
import { FOCUS_KEY } from "./_metadata-keys";

export function FocusTests(constructor: Function) {

    // mark test class as focussed
    Reflect.defineMetadata(FOCUS_KEY, true, constructor);
};
