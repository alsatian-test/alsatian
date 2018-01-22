import "reflect-metadata";
import { TEST_CASES, TESTS } from "./_metadata-keys";
import { Unused } from "../unused";

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
    Unused(descriptor);

    // check if this has been registered as a test already
    let tests: Array<any> = Reflect.getMetadata(TESTS, target);

    if (!tests) {
      // if there are no tests registered yet then register it
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
