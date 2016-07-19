import "reflect-metadata";

export function Teardown(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<() => any>) {

    let teardownFunctions: Array<string> = Reflect.getMetadata("alsatian:teardown", target);

    if (!teardownFunctions) {
      teardownFunctions = [];
    }

    teardownFunctions.push(propertyKey);

    // mark as teardown test method
    Reflect.defineMetadata("alsatian:teardown", teardownFunctions, target);
};
