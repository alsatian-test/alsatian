import "reflect-metadata";
import {
  Expect,
  METADATA_KEYS,
  Test,
  TestCase,
  SpyOn,
  TestFixture
} from "../../../core/alsatian-core";
import { Ignore } from "../../../core/decorators/ignore-decorator";
import { Warner } from "../../../core/maintenance/warn";

@TestFixture("Ignore decorator tests")
export class IgnoreDecoratorTests {
  @TestCase("key")
  @TestCase("another key")
  @TestCase("something-different")
  public ignoreTestKeyMetaDataAddedToCorrectKey(key: string) {
    const ignore = Ignore("");
    const testFixture = {};

    ignore(testFixture, key, null);

    Expect(Reflect.getMetadata(METADATA_KEYS.IGNORE, testFixture, key)).toBe(
      true
    );
  }

  @TestCase("Ignored because of bla bla bla")
  @TestCase("another reason for it being ignored")
  @TestCase("bla bla bla")
  public ignoreTestCorrectReasonAdded(reason: string) {
    const key = "testKey";

    const ignore = Ignore(reason);
    const testFixture = {};

    ignore(testFixture, key, null);

    Expect(
      Reflect.getMetadata(METADATA_KEYS.IGNORE_REASON, testFixture, key)
    ).toBe(reason);
  }

  @Test()
  public ignoreTestFixtureMetaDataAdded(key: string) {
    const ignore = Ignore("");

    class TestFixtureClass {}

    ignore(TestFixtureClass);
    Expect(Reflect.getMetadata(METADATA_KEYS.IGNORE, TestFixtureClass)).toBe(
      true
    );
  }

  @TestCase("Ignored because of bla bla bla")
  @TestCase("another reason for it being ignored")
  @TestCase("bla bla bla")
  public ignoreTestFixtureCorrectReasonAdded(reason: string) {
    const ignoreTestDecorator = Ignore(reason);

    class TestFixtureClass {}

    ignoreTestDecorator(TestFixtureClass);

    Expect(
      Reflect.getMetadata(METADATA_KEYS.IGNORE_REASON, TestFixtureClass)
    ).toBe(reason);
  }
}
