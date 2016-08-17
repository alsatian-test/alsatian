import "reflect-metadata";

export function IgnoreTests(reason?: string) {
    return (constructor: Function) => {
        // mark test class as ignored
        Reflect.defineMetadata("alsatian:ignore", true, constructor);
    };
}
