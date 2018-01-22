import "reflect-metadata";
import { TESTS } from "./_metadata-keys";
import { Unused } from "../unused";

export function Test(description?: string) {
  return (
    target: object,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    Unused(descriptor);

    // check if this has been registered as a test already
    let tests: Array<any> = Reflect.getMetadata(TESTS, target);

    // if there are no tests registered yet then register it
    if (!tests) {
      tests = [
        {
          key: propertyKey
        }
      ];
    } else if (tests.filter(test => test.key === propertyKey).length === 0) {
      // otherwise add it to the register
      tests.push({
        key: propertyKey
      });
    }

    // set the description
    tests.filter(test => test.key === propertyKey)[0].description = description;

    // update the register
    Reflect.defineMetadata(TESTS, tests, target);
  };
}
