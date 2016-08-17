import "reflect-metadata";
import { SETUP_KEY } from "./_metadata-keys";

export function Setup(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<() => any>) {

    let setupFunctions: Array<string> = Reflect.getMetadata(SETUP_KEY, target);

    if (!setupFunctions) {
      setupFunctions = [];
    }

    setupFunctions.push(propertyKey);

    // mark as setup test method
    Reflect.defineMetadata(SETUP_KEY, setupFunctions, target);
};
