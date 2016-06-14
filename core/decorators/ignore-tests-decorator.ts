import "reflect-metadata";

export function IgnoreTests(constructor: Function) {

    // mark test class as ignored
    Reflect.defineMetadata("alsatian:ignore", true, constructor);
};
