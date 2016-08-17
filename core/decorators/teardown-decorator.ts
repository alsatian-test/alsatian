import "reflect-metadata";
import { TEARDOWN_KEY } from "./_metadata-keys";

export function Teardown(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<() => any>) {

    let teardownFunctions: Array<string> = Reflect.getMetadata(TEARDOWN_KEY, target);

    if (!teardownFunctions) {
      teardownFunctions = [];
    }

    teardownFunctions.push(propertyKey);

    // mark as teardown test method
    Reflect.defineMetadata(TEARDOWN_KEY, teardownFunctions, target);
};
