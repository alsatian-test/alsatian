import { TestRunner } from "../../../core/test-runner";
import { TestSet } from "../../../core/test-set";
import { Expect, Test, TestCase, SpyOn } from "../../../core/alsatian-core";

export class AlsatianCoreTests {

   @Test()
   public emptyTestFixturesExitsWithCodeOne() {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      SpyOn(process, "exit").andStub();
      SpyOn(process.stderr, "write").andStub();

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      Expect(process.exit).toHaveBeenCalledWith(1);
   }

   @Test()
   public emptyTestFixturesOutputsNoTestError() {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      SpyOn(process, "exit").andStub();
      SpyOn(process.stderr, "write").andStub();

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      Expect(process.stderr.write).toHaveBeenCalledWith("no tests to run");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public testFixtureWithEmptyTestsOutputsNoTestError(testCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      testSet.testFixtures.push({ tests: [] });

      for (let i = 0; i < testCount; i++) {
        testSet.testFixtures[0].tests.push({ testCases: [] });
      }

      SpyOn(process, "exit").andStub();
      SpyOn(process.stderr, "write").andStub();

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      Expect(process.stderr.write).toHaveBeenCalledWith("no tests to run");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public multiplTestFixtureWithEmptyTestOutputsNoTestError(testFixtureCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
        testSet.testFixtures.push({ tests: [] });
      }

      SpyOn(process, "exit").andStub();
      SpyOn(process.stderr, "write").andStub();

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      Expect(process.stderr.write).toHaveBeenCalledWith("no tests to run");
   }

   @TestCase(1, 1)
   @TestCase(1, 2)
   @TestCase(1, 42)
   @TestCase(2, 1)
   @TestCase(2, 2)
   @TestCase(2, 42)
   @TestCase(42, 1)
   @TestCase(42, 2)
   @TestCase(42, 42)
   public multiplTestFixtureWithMultipleEmptyTestOutputsNoTestError(testFixtureCount: number, testCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
        testSet.testFixtures.push({ tests: [] });

        for (let j = 0; j < testCount; j++) {
          testSet.testFixtures[0].tests.push({ testCases: [] });
        }
      }

      SpyOn(process, "exit").andStub();
      SpyOn(process.stderr, "write").andStub();

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      Expect(process.stderr.write).toHaveBeenCalledWith("no tests to run");
   }
}
