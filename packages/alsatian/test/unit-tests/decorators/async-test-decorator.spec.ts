import "reflect-metadata";
import {
  Expect,
  METADATA_KEYS,
  Test,
  TestCase
} from "../../../core/alsatian-core";
import { AsyncTest as AsyncTestDecorator } from "../../../core/decorators/async-test-decorator";

export class AsyncTestDecoratorTests {
  @Test()
  public testAddedAsMetaData() {
    const asyncTestDecorator = AsyncTestDecorator();

    const testFixture = {};

    asyncTestDecorator(testFixture, "test", null);

    const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

    Expect(tests).toBeDefined();
    Expect(tests).not.toBeNull();
  }

  @Test()
  public testMetaDataMarkedAsAsync() {
    const asyncTestDecorator = AsyncTestDecorator();

    const testFixture = {};

    asyncTestDecorator(testFixture, "test", null);

    const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

    Expect(tests[0].isAsync).toBe(true);
  }

  @TestCase("key")
  @TestCase("another key")
  @TestCase("something-different")
  public testKeyMetaDataAdded(key: string) {
    const asyncTestDecorator = AsyncTestDecorator();

    const testFixture = {};

    asyncTestDecorator(testFixture, key, null);

    const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

    Expect(tests[0].key).toBe(key);
  }

  @TestCase("Some Test")
  @TestCase("Another sort of test")
  @TestCase("Make sure it works")
  public testDescriptionMetaDataAdded(description: string) {
    const asyncTestDecorator = AsyncTestDecorator(description);

    const testFixture = {};

    asyncTestDecorator(testFixture, "key", null);

    const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

    Expect(tests[0].description).toBe(description);
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public correctTestCountAdded(testCount: number) {
    const asyncTestDecorator = AsyncTestDecorator();

    const testFixture = {};

    for (let i = 0; i < testCount; i++) {
      asyncTestDecorator(testFixture, "key " + i, null);
    }

    const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

    Expect(tests.length).toBe(testCount);
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public noDuplicateTestKeysAdded(testCount: number) {
    const testDecorator = AsyncTestDecorator();

    const testFixture = {};

    for (let i = 0; i < testCount; i++) {
      testDecorator(testFixture, "key", null);
    }

    const tests = Reflect.getMetadata(METADATA_KEYS.TESTS, testFixture);

    Expect(tests.length).toBe(1);
  }
}
