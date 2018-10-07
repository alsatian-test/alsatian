import "reflect-metadata";
import {
  Expect,
  METADATA_KEYS,
  SpyOn,
  Test
} from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

class FakeFixture {
  constructor () {        
    Reflect.defineMetadata(METADATA_KEYS.TESTS, [], this);
  }
}

export class DefaultExportFixtureTests {
  @Test()
  public ignoredShouldBeFalseByDefault() {
    const fileRequirer = new FileRequirer();

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(FakeFixture);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].ignored).toBe(false);
  }

  @Test()
  public ignoredShouldBeTrueIfMetadataSet() {
    const fileRequirer = new FileRequirer();

    class IgnoredFakeFixture {
      constructor () {        
        Reflect.defineMetadata(METADATA_KEYS.TESTS, [], this);
      }
    }

    Reflect.defineMetadata(METADATA_KEYS.IGNORE, true, IgnoredFakeFixture);

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(IgnoredFakeFixture);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].ignored).toBe(true);
  }

  @Test()
  public focussedShouldBeFalseByDefault() {
    const fileRequirer = new FileRequirer();

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(FakeFixture);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].focussed).toBe(false);
  }

  @Test()
  public focussedShouldBeTrueIfMetadataSet() {
    const fileRequirer = new FileRequirer();

    class FocusedFakeFixture {
      constructor () {        
        Reflect.defineMetadata(METADATA_KEYS.TESTS, [], this);
      }
    }

    Reflect.defineMetadata(METADATA_KEYS.FOCUS, true, FocusedFakeFixture);

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(FocusedFakeFixture);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].focussed).toBe(true);
  }

  @Test()
  public noTestsReturnsEmptyArray() {
    const fileRequirer = new FileRequirer();

    class NotAFixture { }

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(NotAFixture);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test").length).toBe(0);
  }
}
