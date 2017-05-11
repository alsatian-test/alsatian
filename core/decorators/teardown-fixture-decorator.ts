import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";
import { TEARDOWN_FIXTURE } from "./_metadata-keys";

export function TeardownFixture(target: object,
                                decoratedPropertyKey: string,
                                descriptor?: TypedPropertyDescriptor<() => any>) {

    let teardownFixtureFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(TEARDOWN_FIXTURE, target);

    if (!teardownFixtureFunctions) {
      teardownFixtureFunctions = [];
    }

    teardownFixtureFunctions.push({
        isAsync: false,
        propertyKey: decoratedPropertyKey
    });

    // mark as teardown test method
    Reflect.defineMetadata(TEARDOWN_FIXTURE, teardownFixtureFunctions, target);
}
