import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";

export function createSetupTeardownDecorator(
  metadataDescription: string,
  isAsync: boolean
) {
  return (
    target: object,
    decoratedPropertyKey: string,
    descriptor?: TypedPropertyDescriptor<() => any>
  ) => {
    const functions: Array<ISetupTeardownMetadata> =
      Reflect.getMetadata(metadataDescription, target) || [];

    functions.push({
      isAsync,
      propertyKey: decoratedPropertyKey
    });

    Reflect.defineMetadata(metadataDescription, functions, target);
  };
}
