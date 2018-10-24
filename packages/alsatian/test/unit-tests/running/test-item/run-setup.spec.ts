import {
  AsyncTest,
  Expect,
  FunctionSpy,
  METADATA_KEYS,
  TestCase
} from "../../../../core/alsatian-core";
import { TestItem } from "../../../../core/running/test-item";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";

export class TestItemRunSetupTests {
  @TestCase(1)
  @TestCase(2)
  @TestCase(10)
  @AsyncTest()
  public async successfulSyncSetup(setupFunctionCount: number) {
    const test = new TestBuilder().withTestCaseCount(1).build();

    const testFixture = new TestFixtureBuilder()
      .withFixture({
        testFunction: () => {}
      })
      .addTest(test)
      .build();

    const setupFunctions: Array<FunctionSpy> = [];
    const setupFunctionInfo = [];

    for (let i = 0; i < setupFunctionCount; i++) {
      const setupFunction = new FunctionSpy();
      setupFunctions.push(setupFunction);
      const setupFunctionKey = "setupFunction" + i + 1;
      testFixture.fixture[setupFunctionKey] = setupFunction as any;
      setupFunctionInfo.push({ propertyKey: setupFunctionKey });
    }

    Reflect.defineMetadata(
      METADATA_KEYS.SETUP,
      setupFunctionInfo,
      testFixture.fixture
    );

    const testItem = new TestItem(testFixture, test, test.testCases[0]);

    await testItem.run(500);

    setupFunctions.forEach(setupFunction => {
      Expect(setupFunction).toHaveBeenCalled();
    });
  }

  @TestCase(1)
  @TestCase(2)
  @TestCase(10)
  @AsyncTest()
  public async successfulAsyncSetup(setupFunctionCount: number) {
    const test = new TestBuilder().withTestCaseCount(1).build();

    const testFixture = new TestFixtureBuilder()
      .withFixture({
        testFunction: () => {}
      })
      .addTest(test)
      .build();

    const setupFunctions = [];
    const setupFunctionInfo = [];
    const setupFunctionsCalled: Array<boolean> = [];

    for (let i = 0; i < setupFunctionCount; i++) {
      const setupFunction = () =>
        new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            setupFunctionsCalled[i] = true;
            resolve();
          }, 10);
        });

      setupFunctions.push(setupFunction);
      const setupFunctionKey = "setupFunction" + i + 1;
      testFixture.fixture[setupFunctionKey] = setupFunction;
      setupFunctionInfo.push({ propertyKey: setupFunctionKey, isAsync: true });
      setupFunctionsCalled.push(false);
    }

    Reflect.defineMetadata(
      METADATA_KEYS.SETUP,
      setupFunctionInfo,
      testFixture.fixture
    );

    const testItem = new TestItem(testFixture, test, test.testCases[0]);

    await testItem.run(500);

    setupFunctionsCalled.forEach(setupFunctionCalled => {
      Expect(setupFunctionCalled).toBe(true);
    });
  }
}
