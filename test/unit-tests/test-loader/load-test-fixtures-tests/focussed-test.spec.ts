import "reflect-metadata";
import {
  Expect,
  METADATA_KEYS,
  SpyOn,
  Test
} from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

export class FocussedTestTests {
  @Test()
  public singleUnfocussedTest() {
    const fileRequirer = new FileRequirer();

    const testFixtureInstance = {
      unfocussedTest: () => {}
    };
    const unfocussedTest = {
      key: "unfocussedTest"
    };
    Reflect.defineMetadata(
      METADATA_KEYS.TESTS,
      [unfocussedTest],
      testFixtureInstance
    );

    const testFixtureConstructor = () => testFixtureInstance;

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureConstructor);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].tests[0].focussed).toBe(false);
  }

  @Test()
  public singleFocussedTest() {
    const fileRequirer = new FileRequirer();

    const testFixtureInstance = {
      focussedTest: () => {}
    };
    const unfocussedTest = {
      key: "focussedTest"
    };
    Reflect.defineMetadata(
      METADATA_KEYS.TESTS,
      [unfocussedTest],
      testFixtureInstance
    );
    Reflect.defineMetadata(
      METADATA_KEYS.FOCUS,
      true,
      testFixtureInstance,
      "focussedTest"
    );

    const testFixtureConstructor = () => testFixtureInstance;

    const spy = SpyOn(fileRequirer, "require");
    spy.andStub();
    spy.andReturn(testFixtureConstructor);

    const testLoader = new TestLoader(fileRequirer);

    Expect(testLoader.loadTestFixture("test")[0].tests[0].focussed).toBe(true);
  }
}
