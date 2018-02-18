import "reflect-metadata";
import { TEST_CASES } from "./_metadata-keys";
import { markPropertyAsTest } from "./mark-property-as-test";

export function TestCase(...testCaseArguments: Array<any>) {
  return (
    target: object,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    markPropertyAsTest(propertyKey, target);

    // check if there are test cases already associated with this test
    let testCases: Array<any> = Reflect.getMetadata(
      TEST_CASES,
      target,
      propertyKey
    );

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
