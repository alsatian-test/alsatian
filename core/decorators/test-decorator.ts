import "reflect-metadata";
import { TESTS_KEY } from "./_metadata-keys";

export function Test(description?: string) {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {

    // check if this has been registered as a test already
    let tests: Array<any> = Reflect.getMetadata(TESTS_KEY, target);

    // if there are no tests registered yet then register it
    if (!tests) {
      tests = [ {
         key: propertyKey
      } ];
    }
    // otherwise add it to the register
    else if (tests.filter(test => test.key === propertyKey).length === 0) {
      tests.push( {
         key: propertyKey
      });
    }

    // set the description
    tests.filter(test => test.key === propertyKey)[0].description = description;

    // update the register
    Reflect.defineMetadata(TESTS_KEY, tests, target);
};
}
