import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";
import { deprecate } from "../maintenance/deprecate";

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

    if (isAsync) {
      const functionName = "Async" + metadataDescription
                            .replace("alsatian:", "")
                            .replace("-fixture", "Fixture") 
                            .replace("setup", "Setup")
                            .replace("teardown", "Teardown");

      deprecate(functionName, "4.0.0", `Use the ${functionName.replace("Async", "")} decorator instead.`);
    }

    functions.push({
      isAsync,
      propertyKey: decoratedPropertyKey
    });

    Reflect.defineMetadata(metadataDescription, functions, target);
  };
}
