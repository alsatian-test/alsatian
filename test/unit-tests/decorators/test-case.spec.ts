import "reflect-metadata";
import { TestCase as TestCaseDecorator } from "../../../core/decorators/test-case-decorator";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class TestCaseDecoratorTests {

  @Test()
  public testAddedAsMetaData() {
    let testCaseDecorator = TestCaseDecorator();

    let testFixture = {};

    testCaseDecorator(testFixture, "test", null);

    let tests = Reflect.getMetadata("alsatian:tests", testFixture);

    Expect(tests).toBeDefined();
    Expect(tests).not.toBeNull();
  }

  @TestCase("key")
  @TestCase("another key")
  @TestCase("something-different")
  public testKeyMetaDataAdded(key: string) {
    let testCaseDecorator = TestCaseDecorator();

    let testFixture = {};

    testCaseDecorator(testFixture, key, null);

    let tests = Reflect.getMetadata("alsatian:tests", testFixture);

    Expect(tests[0].key).toBe(key);
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public correctTestCountAdded(testCount: number) {
    let testCaseDecorator = TestCaseDecorator();

    let testFixture = {};

    for (let i = 0; i < testCount; i ++) {
      testCaseDecorator(testFixture, "key " + i, null);
    }

    let tests = Reflect.getMetadata("alsatian:tests", testFixture);

    Expect(tests.length).toBe(testCount);
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public noDuplicateTestKeysAdded(testCount: number) {
    let testCaseDecorator = TestCaseDecorator();

    let testFixture = {};

    for (let i = 0; i < testCount; i ++) {
      testCaseDecorator(testFixture, "key", null);
    }

    let tests = Reflect.getMetadata("alsatian:tests", testFixture);

    Expect(tests.length).toBe(1);
  }

  @Test()
  public testCasesAddedAsMetaData() {
    let testCaseDecorator = TestCaseDecorator();

    let testFixture = {};

    testCaseDecorator(testFixture, "test", null);

    let testCases = Reflect.getMetadata("alsatian:testcases", testFixture, "test");

    Expect(testCases).toBeDefined();
    Expect(testCases).not.toBeNull();
  }

  @TestCase([])
  @TestCase([ 1, 2, 3 ])
  @TestCase([ "this", "that", "the other" ])
  public testCaseArgumentsMetaDataAdded(expectedArguments: Array<any>) {
    let testCaseDecorator = TestCaseDecorator.apply(TestCaseDecorator, expectedArguments);

    let testFixture = {};

    testCaseDecorator(testFixture, "key", null);

    let testCases = Reflect.getMetadata("alsatian:testcases", testFixture, "key");

    Expect(testCases[0].arguments).toEqual(expectedArguments);
  }

  @TestCase("key")
  @TestCase("another key")
  @TestCase("something-different")
  public testCaseKeyMetaDataAddedWithCorrectKey(key: string) {
    let testCaseDecorator = TestCaseDecorator();

    let testFixture = {};

    testCaseDecorator(testFixture, key, null);

    let testCases = Reflect.getMetadata("alsatian:testcases", testFixture, key);

    Expect(testCases).toBeDefined();
    Expect(testCases).not.toBeNull();
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public testCaseArgumentsAlwaysAddedAsFirstIndex(testCount: number) {

    let dummyTestCaseDecorator = TestCaseDecorator();

    let testFixture = {};

    for (let i = 0; i < testCount; i ++) {
      dummyTestCaseDecorator(testFixture, "key " + i, null);
    }

    let args = [ 1, 2, 3 ];
    TestCaseDecorator.apply(TestCaseDecorator, args)(testFixture, "key", null);

    let testCases = Reflect.getMetadata("alsatian:testcases", testFixture, "key");

    Expect(testCases[0].arguments).toEqual(args);
  }
}
