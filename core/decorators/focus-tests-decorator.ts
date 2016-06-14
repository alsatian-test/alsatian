import "reflect-metadata";

export function FocusTests(constructor: Function) {

    // mark test class as focussed
    Reflect.defineMetadata("alsatian:focus", true, constructor);
};
