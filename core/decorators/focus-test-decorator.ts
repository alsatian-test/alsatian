import "reflect-metadata";

export function FocusTest(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {

    // mark test method as focussed
    Reflect.defineMetadata("alsatian:focus", true, target, propertyKey);
};
