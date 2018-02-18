import "reflect-metadata";
import { TESTS } from "./_metadata-keys";
import { markPropertyAsTest } from "./mark-property-as-test";

export function Test(description?: string) {
  return (
    target: object,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    // check if this has been registered as a test already
    markPropertyAsTest(propertyKey, target);

    // get tests
    const tests: Array<any> = Reflect.getMetadata(TESTS, target);

    // set the description
    tests.filter(test => test.key === propertyKey)[0].description = description;

    // update the register
    Reflect.defineMetadata(TESTS, tests, target);
  };
}
