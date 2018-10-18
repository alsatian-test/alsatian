import "reflect-metadata";
import { ISetupTeardownMetadata } from "./_interfaces";
import { deprecate } from "../maintenance/deprecate";
import { SETUP_FIXTURE } from "./_metadata-keys";

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

    const functionName = metadataDescription
      .replace("alsatian:", "")
      .replace("-fixture", "Fixture")
      .replace("setup", "Setup")
      .replace("teardown", "Teardown");

    if (metadataDescription.indexOf("-fixture") > -1 || isAsync) {
      deprecate(
        isAsync ? `Async${functionName}` : functionName,
        "4.0.0",
        `Use the ${functionName.replace("Fixture", "")} decorator instead.`
      );
    }

    functions.push({
      isAsync,
      propertyKey: decoratedPropertyKey
    });

    Reflect.defineMetadata(metadataDescription, functions, target);
  };
}
