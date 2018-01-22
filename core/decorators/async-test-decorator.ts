import "reflect-metadata";
import { TESTS } from "./_metadata-keys";
import { Unused } from "../unused";
import { markPropertyAsTest } from "./mark-property-as-test";

export function AsyncTest(description?: string) {
  return (
    target: object,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<(...args: Array<any>) => Promise<any>>
  ) => {
    Unused(descriptor);

    // check if this has been registered as a test already
    markPropertyAsTest(propertyKey, target);
    
    // get tests
    const tests: Array<any> = Reflect.getMetadata(TESTS, target);

    // mark it as async and add the description
    const testDefinition = tests.filter(test => test.key === propertyKey)[0];
    testDefinition.isAsync = true;
    testDefinition.description = description;

    // update the register
    Reflect.defineMetadata(TESTS, tests, target);
  };
}
