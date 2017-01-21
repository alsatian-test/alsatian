import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";
import { TEARDOWN } from "./_metadata-keys";

export function AsyncTeardown(target: any,
                              decoratedPropertyKey: string,
                              descriptor: TypedPropertyDescriptor<() => any>) {

    let teardownFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(TEARDOWN, target);

    if (!teardownFunctions) {
      teardownFunctions = [];
    }

    teardownFunctions.push({
        isAsync: true,
        propertyKey: decoratedPropertyKey
    });

    // mark as setup test method
    Reflect.defineMetadata(TEARDOWN, teardownFunctions, target);
};
