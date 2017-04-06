import "reflect-metadata";
import { TESTS } from "./_metadata-keys";

export function Test(description?: string) {
  return (target: object, propertyKey: string, descriptor?: TypedPropertyDescriptor<any>) => {

    // check if this has been registered as a test already
    let tests: Array<any> = Reflect.getMetadata(TESTS, target);

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
    Reflect.defineMetadata(TESTS, tests, target);
};
}
