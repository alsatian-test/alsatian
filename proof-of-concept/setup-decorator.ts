import "reflect-metadata";

export function Setup(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<() => any>) {

    let setupFunctions: Array<string> = Reflect.getMetadata("alsatian:setup", target);

    if (!setupFunctions) {
      setupFunctions = [];
    }

    setupFunctions.push(propertyKey);

    // mark as setup test method
    Reflect.defineMetadata("alsatian:setup", setupFunctions, target);
};
