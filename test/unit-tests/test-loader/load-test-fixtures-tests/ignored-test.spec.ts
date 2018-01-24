import "reflect-metadata";
import {
  Expect,
  METADATA_KEYS,
  SpyOn,
  Test,
  TestCase
} from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

export class IgnoredTestTests {
  @Test()
  public singleUnignoredTest() {
    const fileRequirer = new FileRequirer();

    const testFixtureInstance = {
      unignoredTest: () => {}
    };
    const unignoredTest = {
      key: "unignoredTest"
    };
    Reflect.defineMetadata(
      METADATA_KEYS.TESTS,
      [unignoredTest],
      testFixtureInstance
    );

    const testFixtureConstructor = () => testFixtureInstance;

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureConstructor);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].tests[0].ignored).toBe(false);
  }

  @Test()
  public singleIgnoredTest() {
    const fileRequirer = new FileRequirer();

    const testFixtureInstance = {
      ignoredTest: () => {}
    };
    const unignoredTest = {
      key: "ignoredTest"
    };
    Reflect.defineMetadata(
      METADATA_KEYS.TESTS,
      [unignoredTest],
      testFixtureInstance
    );
    Reflect.defineMetadata(
      METADATA_KEYS.IGNORE,
      true,
      testFixtureInstance,
      "ignoredTest"
    );

    const testFixtureConstructor = () => testFixtureInstance;

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureConstructor);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].tests[0].ignored).toBe(true);
  }

  @TestCase("some reason")
  @TestCase("another reason")
  @TestCase("last one, promise!")
  public singleIgnoredTestWithReason(reason: string) {
    const fileRequirer = new FileRequirer();

    const testFixtureInstance = {
      ignoredTest: () => {}
    };
    const unignoredTest = {
      key: "ignoredTest"
    };
    Reflect.defineMetadata(
      METADATA_KEYS.TESTS,
      [unignoredTest],
      testFixtureInstance
    );
    Reflect.defineMetadata(
      METADATA_KEYS.IGNORE,
      true,
      testFixtureInstance,
      "ignoredTest"
    );
    Reflect.defineMetadata(
      METADATA_KEYS.IGNORE_REASON,
      reason,
      testFixtureInstance,
      "ignoredTest"
    );

    const testFixtureConstructor = () => testFixtureInstance;

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureConstructor);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].tests[0].ignoreReason).toBe(
      reason
    );
  }
}
