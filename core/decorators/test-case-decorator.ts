import "reflect-metadata";
import { TEST_CASES, TESTS } from "./_metadata-keys";

export function TestCase(...testCaseArguments: Array<any>) {
  return (target: Object, propertyKey: string, descriptor?: TypedPropertyDescriptor<any>) => {

    // check if this has been registered as a test already
    let tests: Array<any> = Reflect.getMetadata(TESTS, target);

    // if there are no tests registered yet then register it
    if (!tests) {
      tests = [  {
         key: propertyKey
      } ];
      Reflect.defineMetadata(TESTS, tests, target);
    }
    // otherwise add it to the register
    else if (tests.filter(test => test.key === propertyKey).length === 0) {
      tests.push( {
         key: propertyKey
      });
      Reflect.defineMetadata(TESTS, tests, target);
    }

    // check if there are test cases already associated with this test
    let testCases: Array<any> = Reflect.getMetadata(TEST_CASES, target, propertyKey);

    // if not create an empty array
    if (!testCases) {
      testCases = [];
    }

    // add the test case to the list
    testCases.unshift({
      caseArguments: testCaseArguments
    });

    // update the list of test cases
    Reflect.defineMetadata(TEST_CASES, testCases, target, propertyKey);
};
}
