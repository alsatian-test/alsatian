import "reflect-metadata";
import { TEARDOWN } from "./_metadata-keys";

export function Teardown(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<() => any>) {

    let teardownFunctions: Array<string> = Reflect.getMetadata(TEARDOWN, target);

    if (!teardownFunctions) {
      teardownFunctions = [];
    }

    teardownFunctions.push(propertyKey);

    // mark as teardown test method
    Reflect.defineMetadata(TEARDOWN, teardownFunctions, target);
};
