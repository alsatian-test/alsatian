import "reflect-metadata";
import { TESTS } from "./_metadata-keys";

export function markPropertyAsTest(propertyKey: string, target: object) {
  // check if this has been registered as a test already
  let tests: Array<any> = Reflect.getMetadata(TESTS, target);

  // if there are no tests registered yet then register it
  if (!tests) {
    tests = [
      {
        key: propertyKey
      }
    ];
    Reflect.defineMetadata(TESTS, tests, target);
  } else if (tests.filter(test => test.key === propertyKey).length === 0) {
    // otherwise add it to the register
    tests.push({
      key: propertyKey
    });
    Reflect.defineMetadata(TESTS, tests, target);
  }
}
