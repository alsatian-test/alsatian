import "reflect-metadata";
import {
  Expect,
  METADATA_KEYS,
  Test,
  TestCase
} from "../../../core/alsatian-core";
import { IgnoreTest as IgnoreTestDecorator } from "../../../core/decorators/ignore-test-decorator";

export class IgnoreTestDecoratorTests {
  @TestCase("key")
  @TestCase("another key")
  @TestCase("something-different")
  public ignoreTestKeyMetaDataAddedToCorrectKey(key: string) {
    const ignoreTestDecorator = IgnoreTestDecorator();
    const testFixture = {};

    ignoreTestDecorator(testFixture, key, null);

    Expect(Reflect.getMetadata(METADATA_KEYS.IGNORE, testFixture, key)).toBe(
      true
    );
  }

  @TestCase("Ignored because of bla bla bla")
  @TestCase("another reason for it being ignored")
  @TestCase("bla bla bla")
  public ignoreTestCorrectReasonAdded(reason: string) {
    const key = "testKey";

    const ignoreTestDecorator = IgnoreTestDecorator(reason);
    const testFixture = {};

    ignoreTestDecorator(testFixture, key, null);

    Expect(
      Reflect.getMetadata(METADATA_KEYS.IGNORE_REASON, testFixture, key)
    ).toBe(reason);
  }
}
