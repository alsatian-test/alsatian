import "reflect-metadata";
import { TEST_KEY, TEST_CASES_KEY } from "./_metadata-keys";

export function TestCase(...testCaseArguments: Array<any>) {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {

    // check if this has been registered as a test already
    let tests: Array<any> = Reflect.getMetadata(TEST_KEY, target);

    // if there are no tests registered yet then register it
    if (!tests) {
      tests = [  {
         key: propertyKey
      } ];
      Reflect.defineMetadata(TEST_KEY, tests, target);
    }
    // otherwise add it to the register
    else if (tests.filter(test => test.key === propertyKey).length === 0) {
      tests.push( {
         key: propertyKey
      });
      Reflect.defineMetadata(TEST_KEY, tests, target);
    }

    // check if there are test cases already associated with this test
    let testCases: Array<any> = Reflect.getMetadata(TEST_CASES_KEY, target, propertyKey);

    // if not create an empty array
    if (!testCases) {
      testCases = [];
    }

    // add the test case to the list
    testCases.unshift({
      arguments: testCaseArguments
    });

    // update the list of test cases
    Reflect.defineMetadata(TEST_CASES_KEY, testCases, target, propertyKey);
};
}
