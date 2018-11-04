import "reflect-metadata";
import {
  Expect,
  METADATA_KEYS,
  Test,
  TestCase,
  SpyOn
} from "../../../core/alsatian-core";
import { Teardown } from "../../../core/decorators/teardown-decorator";
import { Warner } from "../../../core/maintenance/warn";

export class TeardownDecoratorTests {
  @Test()
  public teardownFunctionAddedAsMetaData() {
    const testFixture = {};

    Teardown(testFixture, "test", null);

    const teardownFunctions = Reflect.getMetadata(
      METADATA_KEYS.TEARDOWN,
      testFixture
    );

    Expect(teardownFunctions).toBeDefined();
    Expect(teardownFunctions).not.toBeNull();
  }

  @TestCase("key")
  @TestCase("another key")
  @TestCase("something-different")
  public teardownFunctionMetaDataAdded(key: string) {
    const testFixture = {};

    Teardown(testFixture, key, null);

    const teardownFunctions = Reflect.getMetadata(
      METADATA_KEYS.TEARDOWN,
      testFixture
    );

    Expect(teardownFunctions[0].propertyKey).toBe(key);
  }

  @TestCase("key")
  @TestCase("another key")
  @TestCase("something-different")
  public teardownFunctionIsAsyncMetaDataAdded(key: string) {
    const testFixture = {};

    Teardown(testFixture, key, null);

    const teardownFunctions = Reflect.getMetadata(
      METADATA_KEYS.TEARDOWN,
      testFixture
    );

    Expect(teardownFunctions[0].isAsync).toBe(false);
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public correctTestCountAdded(teardownFunctionCount: number) {
    const testFixture = {};

    for (let i = 0; i < teardownFunctionCount; i++) {
      Teardown(testFixture, "key " + i, null);
    }

    const teardownFunctions = Reflect.getMetadata(
      METADATA_KEYS.TEARDOWN,
      testFixture
    );

    Expect(teardownFunctions.length).toBe(teardownFunctionCount);
  }

  @Test("deprecation warning not added")
  public deprecationWarningNotAdded() {
    SpyOn(Warner, "warn");

    Teardown({}, "");

    Expect(Warner.warn).not.toHaveBeenCalled();
  }
}
