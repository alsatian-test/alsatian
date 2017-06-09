import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";
import { TEARDOWN_FIXTURE } from "./_metadata-keys";
import { Unused } from "../unused";

export function AsyncTeardownFixture(target: object,
                                     decoratedPropertyKey: string,
                                     descriptor?: TypedPropertyDescriptor<() => any>) {
    Unused(descriptor);

    let teardownFixtureFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(TEARDOWN_FIXTURE, target);

    if (!teardownFixtureFunctions) {
      teardownFixtureFunctions = [];
    }

    teardownFixtureFunctions.push({
        isAsync: true,
        propertyKey: decoratedPropertyKey
    });

    // mark as teardown test method
    Reflect.defineMetadata(TEARDOWN_FIXTURE, teardownFixtureFunctions, target);
}
