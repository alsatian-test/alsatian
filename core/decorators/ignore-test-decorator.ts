import "reflect-metadata";

export function IgnoreTest(reason?: string) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {

        // mark test method as ignored
        Reflect.defineMetadata("alsatian:ignore", true, target, propertyKey);
    };
}
