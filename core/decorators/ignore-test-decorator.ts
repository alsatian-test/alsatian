import "reflect-metadata";

export function IgnoreTest(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {

    // mark test method as ignored
    Reflect.defineMetadata("alsatian:ignore", true, target, propertyKey);
};
