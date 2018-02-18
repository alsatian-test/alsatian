import "reflect-metadata";
import { TEST_CASES } from "./_metadata-keys";
import { markPropertyAsTest } from "./mark-property-as-test";

function GetTestCases(
  caseArguments:
    | (() => IterableIterator<any> | Array<Array<any>>)
    | IterableIterator<any>
    | Array<Array<any>>
): Array<Array<any>> {
  if (null === caseArguments || undefined === caseArguments) {
    return [];
  }

  if (caseArguments instanceof Function) {
    return GetTestCases(caseArguments());
  }

  if (caseArguments instanceof Array) {
    return [...caseArguments];
  } else {
    return Array.from(caseArguments);
  }
}

export function TestCases(
  caseArguments:
    | (() => IterableIterator<any> | Array<Array<any>>)
    | IterableIterator<any>
    | Array<Array<any>>
): (
  target: object,
  propertyKey: string,
  descriptor?: TypedPropertyDescriptor<any>
) => void {
  return (
    target: object,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    markPropertyAsTest(propertyKey, target);

    const testCases = GetTestCases(caseArguments).reduce((acc, val) => {
      // add the test case to the list
      return [
        ...acc,
        {
          caseArguments: val
        }
      ];
    }, (Reflect.getMetadata(TEST_CASES, target, propertyKey) as Array<any>) || []);

    // update the list of test cases
    Reflect.defineMetadata(TEST_CASES, testCases, target, propertyKey);
  };
}
