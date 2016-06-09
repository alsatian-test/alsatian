import "reflect-metadata";

export function TestCase(...testCaseArguments: Array<any>) {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {

    // check if this has been registered as a test already
    let tests: Array<string> = Reflect.getMetadata("alsatian:tests", target);

    // if there are no tests registered yet then register it
    if (!tests) {
      tests = [ propertyKey ];
      Reflect.defineMetadata("alsatian:tests", tests, target);
    }
    // otherwise add it to the register
    else if (tests.indexOf(propertyKey) === -1) {
      tests.push(propertyKey);
      Reflect.defineMetadata("alsatian:tests", tests, target);
    }

    // check if there are test cases already associated with this test
    let testCases: Array<any> = Reflect.getMetadata("alsatian:testcases", target, propertyKey);

    // if not create an empty array
    if (!testCases) {
      testCases = [];
    }

    // add the test case to the list
    testCases.unshift({
      arguments: testCaseArguments
    });

    // update the list of test cases
    Reflect.defineMetadata("alsatian:testcases", testCases, target, propertyKey);
  }
}
