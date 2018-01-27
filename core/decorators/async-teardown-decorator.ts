import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";
import { TEARDOWN } from "./_metadata-keys";
import { Unused } from "../unused";

export function AsyncTeardown(
  target: object,
  decoratedPropertyKey: string,
  descriptor?: TypedPropertyDescriptor<() => any>
) {
  Unused(descriptor);

  let teardownFunctions: Array<ISetupTeardownMetadata> = Reflect.getMetadata(
    TEARDOWN,
    target
  );

  if (!teardownFunctions) {
    teardownFunctions = [];
  }

  teardownFunctions.push({
    isAsync: true,
    propertyKey: decoratedPropertyKey
  });

  // mark as setup test method
  Reflect.defineMetadata(TEARDOWN, teardownFunctions, target);
}
