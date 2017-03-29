import { AsyncTest, Expect, Setup, SpyOn, Teardown, TestCase, Timeout } from "../../../../core/alsatian-core";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestOutputStream } from "../../../../core/test-output-stream";
import { TestSet } from "../../../../core/test-set";
import { TestBuilder } from "../../../builders/test-builder";
import { TestCaseBuilder } from "../../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";

export class PreTestTests {

   private _originalStdOut: any;
   private _originalProcessExit: any;

   @AsyncTest()
   public async tapVersionHeaderOutput() {
      const testSet = {} as TestSet;

      (testSet as any).testFixtures = [];
      const testFixtureBuilder = new TestFixtureBuilder();
      const testBuilder = new TestBuilder();
      testBuilder.addTestCase(new TestCaseBuilder().build());
      testFixtureBuilder.addTest(testBuilder.build());
      testSet.testFixtures.push(testFixtureBuilder.build());

      const output = new TestOutputStream();
      SpyOn(output, "push");

      const testRunner = new TestRunner(output);
      await testRunner.run(testSet);
      Expect(output.push).toHaveBeenCalledWith("TAP version 13\n");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(5)
   @AsyncTest()
   public async multipleTestFixtureWithSingleTestOutputsCorrectTestNumber(testFixtureCount: number) {
      const testSet = {} as TestSet;

      (testSet as any).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
         const testFixtureBuilder = new TestFixtureBuilder();
         const testBuilder = new TestBuilder();
         testBuilder.addTestCase(new TestCaseBuilder().build());
         testFixtureBuilder.addTest(testBuilder.build());
         testSet.testFixtures.push(testFixtureBuilder.build());
      }

      const output = new TestOutputStream();
      SpyOn(output, "push");

      const testRunner = new TestRunner(output);
      await testRunner.run(testSet);
      Expect(output.push).toHaveBeenCalledWith("1.." + testFixtureCount + "\n");
   }

   @TestCase(1, 1)
   @TestCase(1, 2)
   @TestCase(1, 5)
   @TestCase(2, 1)
   @TestCase(2, 2)
   @TestCase(2, 5)
   @TestCase(5, 1)
   @TestCase(5, 2)
   @TestCase(5, 5)
   @AsyncTest()
   public async multipleTestFixtureWithMultipleTestsOutputsCorrectTestCount(testFixtureCount: number,
                                                                            testCount: number) {
      const testSet = {} as TestSet;

      (testSet as any).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {

         const testFixtureBuilder = new TestFixtureBuilder();

         for (let j = 0; j < testCount; j++) {
            const testFunctionKey = "testFunction" + j;
            const testBuilder = new TestBuilder().withKey(testFunctionKey);
            testBuilder.addTestCase(new TestCaseBuilder().build());
            testFixtureBuilder.addTest(testBuilder.build());
         }

         testSet.testFixtures.push(testFixtureBuilder.build());
      }

      const resultPromise: any = {
         catch: (error: Error) => {},
         resolve: () => {

         },
         then: (callback: (testResults: Array<any>) => any) => {
            resultPromise.resolve = callback;
            return resultPromise;
         }
      };

      const output = new TestOutputStream();
      SpyOn(output, "push");

      const testRunner = new TestRunner(output);

      await testRunner.run(testSet);

      Expect(output.push).toHaveBeenCalledWith("1.." + (testFixtureCount * testCount) + "\n");
   }

   @TestCase(1, 1, 1)
   @TestCase(1, 2, 1)
   @TestCase(1, 5, 1)
   @TestCase(2, 1, 1)
   @TestCase(2, 2, 1)
   @TestCase(2, 5, 1)
   @TestCase(5, 1, 1)
   @TestCase(5, 2, 1)
   @TestCase(5, 5, 1)
   @TestCase(1, 1, 2)
   @TestCase(1, 2, 2)
   @TestCase(1, 5, 2)
   @TestCase(2, 1, 2)
   @TestCase(2, 2, 2)
   @TestCase(2, 5, 2)
   @TestCase(5, 1, 2)
   @TestCase(5, 2, 2)
   @TestCase(5, 5, 2)
   @TestCase(1, 1, 5)
   @TestCase(1, 2, 5)
   @TestCase(1, 5, 5)
   @TestCase(2, 1, 5)
   @TestCase(2, 2, 5)
   @TestCase(2, 5, 5)
   @TestCase(5, 1, 5)
   @TestCase(5, 2, 5)
   @Timeout(1000)
   @AsyncTest()
   public async multipleTestFixtureWithMultipleTestsWithMultipleTestCasesOutputsCorrectTestCount(
                                            testFixtureCount: number,
                                            testCount: number,
                                            testCaseCount: number) {

      const testSet = {} as TestSet;

      (testSet as any).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {

         const testFixtureBuilder = new TestFixtureBuilder();

         for (let j = 0; j < testCount; j++) {
            const testFunctionKey = "testFunction" + j;
            const testBuilder = new TestBuilder().withKey(testFunctionKey);
            testFixtureBuilder.addTest(testBuilder.build());

            for (let k = 0; k < testCaseCount; k++) {
               testBuilder.addTestCase(new TestCaseBuilder().build());
            }
         }

         testSet.testFixtures.push(testFixtureBuilder.build());
      }

      const output = new TestOutputStream();
      SpyOn(output, "push");

      const testRunner = new TestRunner(output);
      await testRunner.run(testSet);
      Expect(output.push).toHaveBeenCalledWith("1.." + (testFixtureCount * testCount * testCaseCount) + "\n");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(5)
   @AsyncTest()
   public async testFixtureWithMultipleTestsAndSecondWithNoneOutputsCorrectTestNumber(testFixtureCount: number) {
      const testSet = {} as TestSet;

      (testSet as any).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
         const testFixtureBuilder = new TestFixtureBuilder();
         const testBuilder = new TestBuilder();
         testBuilder.addTestCase(new TestCaseBuilder().build());
         testFixtureBuilder.addTest(testBuilder.build());
         testSet.testFixtures.push(testFixtureBuilder.build());
      }

      const testFixtureBuilder = new TestFixtureBuilder();
      testSet.testFixtures.push(testFixtureBuilder.build());

      const output = new TestOutputStream();
      SpyOn(output, "push");

      const testRunner = new TestRunner(output);
      await testRunner.run(testSet);
      Expect(output.push).toHaveBeenCalledWith("1.." + testFixtureCount + "\n");
   }
}
