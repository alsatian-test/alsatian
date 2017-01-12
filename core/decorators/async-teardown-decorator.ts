import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";
import { TEARDOWN } from "./_metadata-keys";

export function AsyncTeardown(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<() => any>) {

    let setupFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(TEARDOWN, target);

    if (!setupFunctions) {
      setupFunctions = [];
    }

    setupFunctions.push({
        isAsync: true,
        propertyKey: propertyKey
    });

    // mark as setup test method
    Reflect.defineMetadata(TEARDOWN, setupFunctions, target);
};