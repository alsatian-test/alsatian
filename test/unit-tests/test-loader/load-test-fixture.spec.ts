import "reflect-metadata";
import { TestFixture as TestFixtureMetadata } from "../../../core/";
import {
  Expect,
  METADATA_KEYS,
  SpyOn,
  SpyOnProperty,
  Test,
  TestCase,
  TestFixture,
  Setup,
  Teardown,
  IgnoreTests
} from "../../../core/alsatian-core";
import { FileRequirer } from "../../../core/file-requirer";
import { TestLoader } from "../../../core/test-loader";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";

class FakeFixture {
  constructor() {
    Reflect.defineMetadata(METADATA_KEYS.TESTS, [], this);
  }
}

@TestFixture("Load Tests")
export class LoadTestTests {
  private _originalStdErr: (message: string) => boolean;
  private _originalExit: (code: number) => never;

  @Setup
  private _spyOnProcess() {
    this._originalStdErr = process.stderr.write;
    SpyOn(process.stderr, "write").andStub();

    this._originalExit = process.exit;
    SpyOn(process, "exit").andStub();
  }

  @Teardown
  private _resetProcess() {
    process.stderr.write = this._originalStdErr;
    process.exit = this._originalExit;
  }

  @Test()
  public ignoredShouldBeFalseByDefault() {
    const fileRequirer = new FileRequirer();

    const testFixtureSet = {
      testFixture: FakeFixture
    };

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].ignored).toBe(false);
  }

  @Test()
  public ignoredShouldBeTrueIfMetadataSet() {
    const fileRequirer = new FileRequirer();

    @TestFixture()
    @IgnoreTests()
    class IgnoredFixture {
      @Test()
      public test() {}
    }

    const testFixtureSet = {
      testFixture: IgnoredFixture
    };

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].ignored).toBe(true);
  }

  @TestCase("first reason")
  @TestCase("the second, and the last")
  public ignoreReasonShouldBeSetFromMetadata(reason: string) {
    const fileRequirer = new FileRequirer();

    const testFixtureSet = {
      testFixture: FakeFixture
    };

    Reflect.defineMetadata(
      METADATA_KEYS.IGNORE,
      true,
      testFixtureSet.testFixture
    );
    Reflect.defineMetadata(
      METADATA_KEYS.IGNORE_REASON,
      reason,
      testFixtureSet.testFixture
    );

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].ignoreReason).toBe(reason);
  }

  @Test()
  public focussedShouldBeFalseByDefault() {
    const fileRequirer = new FileRequirer();

    const testFixtureSet = {
      testFixture: FakeFixture
    };

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].focussed).toBe(false);
  }

  @Test()
  public focussedShouldBeTrueIfMetadataSet() {
    const fileRequirer = new FileRequirer();

    const testFixtureSet = {
      testFixture: FakeFixture
    };

    Reflect.defineMetadata(
      METADATA_KEYS.FOCUS,
      true,
      testFixtureSet.testFixture
    );

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].focussed).toBe(true);
  }

  @Test()
  public noTestsReturnsEmptyArray() {
    const fileRequirer = new FileRequirer();

    class NotAFixture {}

    const testFixtureSet = {
      testFixture: NotAFixture
    };

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test").length).toBe(0);
  }

  @TestCase("something")
  @TestCase("wow, this is super!")
  @TestCase("Mega Hyper AWESOME test...")
  public descriptionShouldBeSetWhenNotConstructor(propertyName: string) {
    const fileRequirer = new FileRequirer();

    const testFixtureSet: { [propertyName: string]: new () => any } = {};

    testFixtureSet[propertyName] = FakeFixture;

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);
    Expect(testLoader.loadTestFixture("test")[0].description).toBe(
      propertyName
    );
  }

  @TestCase("something")
  @TestCase("wow, this is super!")
  @TestCase("Mega Hyper AWESOME test...")
  public descriptionShouldBeSetToConstructorNameWhenConstructor(
    constructorName: string
  ) {
    const fileRequirer = new FileRequirer();

    const testFixtureSet = FakeFixture;
    SpyOnProperty(testFixtureSet, "name").andReturnValue(constructorName);

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].description).toBe(
      constructorName
    );
  }

  @TestCase("something")
  @TestCase("wow, this is super!")
  @TestCase("Mega Hyper AWESOME test...")
  public descriptionShouldBeSetWhenMetadataOnDefault(
    testFixtureDescription: string
  ) {
    const fileRequirer = new FileRequirer();

    const testFixtureSet = FakeFixture;

    const testFixtureMetadata = new TestFixtureMetadata(testFixtureDescription);
    Reflect.defineMetadata(
      METADATA_KEYS.TEST_FIXTURE,
      testFixtureMetadata,
      testFixtureSet
    );

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].description).toBe(
      testFixtureDescription
    );
  }

  @TestCase("something")
  @TestCase("wow, this is super!")
  @TestCase("Mega Hyper AWESOME test...")
  public descriptionShouldBeSetWhenMetadataOnExportedMember(
    testFixtureDescription: string
  ) {
    const fileRequirer = new FileRequirer();

    const testFixtureSet = {
      testFixture: FakeFixture
    };

    const testFixtureMetadata = new TestFixtureMetadata(testFixtureDescription);
    Reflect.defineMetadata(
      METADATA_KEYS.TEST_FIXTURE,
      testFixtureMetadata,
      testFixtureSet.testFixture
    );

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].description).toBe(
      testFixtureDescription
    );
  }

  public shouldIgnoreTestsIfFixtureIgnored() {
    const fileRequirer = new FileRequirer();

    const testOne = new TestBuilder()
      .withKey("testOne")
      .addTestCase(new TestCaseBuilder().build())
      .build();

    const testTwo = new TestBuilder()
      .withKey("testTwo")
      .addTestCase(new TestCaseBuilder().build())
      .build();

    const fixture = new TestFixtureBuilder()
      .addTest(testOne)
      .addTest(testTwo)
      .build();

    const testFixtureSet = {
      testFixture: () => fixture
    };

    Reflect.defineMetadata(
      METADATA_KEYS.IGNORE,
      true,
      testFixtureSet.testFixture
    );
    Reflect.defineMetadata(METADATA_KEYS.TESTS, [testOne, testTwo], fixture);

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    const loadedFixture = testLoader.loadTestFixture("")[0]; // get the first (only) loaded fixture

    Expect(loadedFixture.tests[0].ignored).toBe(true);
    Expect(loadedFixture.tests[1].ignored).toBe(true);
  }

  @TestCase("first test ignore reason")
  @TestCase("another one!")
  public shouldIgnoreTestsWithReasonIfFixtureIgnored(reason: string) {
    const fileRequirer = new FileRequirer();

    @TestFixture()
    @IgnoreTests(reason)
    class IgnoredFixture {
      @Test()
      public testOne() {}

      @Test()
      public testTwo() {}
    }

    const testFixtureSet = {
      testFixture: IgnoredFixture
    };

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureSet);

    const testLoader = new TestLoader(fileRequirer);

    const loadedFixture = testLoader.loadTestFixture("")[0]; // get the first (only) loaded fixture

    Expect(loadedFixture.tests[0].ignoreReason).toBe(reason);
    Expect(loadedFixture.tests[1].ignoreReason).toBe(reason);
  }

  @TestCase("/path/", "stack_trace")
  @TestCase("C:\\some_other\\path", "a-bad-error-trace")
  public shouldWriteToErrorLogWithCorrectMessage(path: string, stack: string) {
    const fileRequirer = new FileRequirer();

    const error = new Error("foo");
    error.stack = stack;

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andCall(() => {
      throw error;
    });

    const testLoader = new TestLoader(fileRequirer);

    testLoader.loadTestFixture(path);

    Expect(process.stderr.write).toHaveBeenCalledWith(
      `ERROR LOADING FILE: ${path}\n${error.stack}`
    );
    Expect(process.exit).toHaveBeenCalledWith(1);
  }
}
