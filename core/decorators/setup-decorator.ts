import "reflect-metadata";
import { SETUP } from "./_metadata-keys";

export function Setup(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<() => any>) {

    let setupFunctions: Array<string> = Reflect.getMetadata(SETUP, target);

    if (!setupFunctions) {
      setupFunctions = [];
    }

    setupFunctions.push(propertyKey);

    // mark as setup test method
    Reflect.defineMetadata(SETUP, setupFunctions, target);
};
