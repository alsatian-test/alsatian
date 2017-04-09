import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";
import { SETUP_FIXTURE } from "./_metadata-keys";

export function AsyncSetupFixture(target: object,
                                  decoratedPropertyKey: string,
                                  descriptor?: TypedPropertyDescriptor<() => any>) {

    let setupFixtureFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(SETUP_FIXTURE, target);

    if (!setupFixtureFunctions) {
      setupFixtureFunctions = [];
    }

    setupFixtureFunctions.push({
        isAsync: true,
        propertyKey: decoratedPropertyKey
    });

    // mark as setup test method
    Reflect.defineMetadata(SETUP_FIXTURE, setupFixtureFunctions, target);
};
