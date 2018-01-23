import "reflect-metadata";
import {
  Expect,
  METADATA_KEYS,
  Test,
  TestCase
} from "../../../core/alsatian-core";
import { Setup } from "../../../core/decorators/setup-decorator";

export class SetupDecoratorTests {
  @Test()
  public setupFunctionAddedAsMetaData() {
    const testFixture = {};

    Setup(testFixture, "test", null);

    const setupFunctions = Reflect.getMetadata(
      METADATA_KEYS.SETUP,
      testFixture
    );

    Expect(setupFunctions).toBeDefined();
    Expect(setupFunctions).not.toBeNull();
  }

  @TestCase("key")
  @TestCase("another key")
  @TestCase("something-different")
  public setupFunctionKeyMetaDataAdded(key: string) {
    const testFixture = {};

    Setup(testFixture, key, null);

    const setupFunctions = Reflect.getMetadata(
      METADATA_KEYS.SETUP,
      testFixture
    );

    Expect(setupFunctions[0].propertyKey).toBe(key);
  }

  @TestCase("key")
  @TestCase("another key")
  @TestCase("something-different")
  public setupFunctionIsAsyncMetaDataAdded(key: string) {
    const testFixture = {};

    Setup(testFixture, key, null);

    const setupFunctions = Reflect.getMetadata(
      METADATA_KEYS.SETUP,
      testFixture
    );

    Expect(setupFunctions[0].isAsync).toBe(false);
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(42)
  public correctTestCountAdded(setupFunctionCount: number) {
    const testFixture = {};

    for (let i = 0; i < setupFunctionCount; i++) {
      Setup(testFixture, "key " + i, null);
    }

    const setupFunctions = Reflect.getMetadata(
      METADATA_KEYS.SETUP,
      testFixture
    );

    Expect(setupFunctions.length).toBe(setupFunctionCount);
  }
}
