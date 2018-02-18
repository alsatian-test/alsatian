import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";
import { SETUP } from "./_metadata-keys";

export function AsyncSetup(
  target: object,
  decoratedPropertyKey: string,
  descriptor?: TypedPropertyDescriptor<() => any>
) {
  let setupFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(
    SETUP,
    target
  );

  if (!setupFunctions) {
    setupFunctions = [];
  }

  setupFunctions.push({
    isAsync: true,
    propertyKey: decoratedPropertyKey
  });

  // mark as setup test method
  Reflect.defineMetadata(SETUP, setupFunctions, target);
}
