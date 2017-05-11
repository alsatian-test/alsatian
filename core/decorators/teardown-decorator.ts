import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";
import { TEARDOWN } from "./_metadata-keys";

export function Teardown(target: object,
                         decoratedPropertyKey: string,
                         descriptor?: TypedPropertyDescriptor<() => any>) {

    let teardownFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(TEARDOWN, target);

    if (!teardownFunctions) {
      teardownFunctions = [];
    }

    teardownFunctions.push({
        isAsync: false,
        propertyKey: decoratedPropertyKey
    });

    // mark as teardown test method
    Reflect.defineMetadata(TEARDOWN, teardownFunctions, target);
}
