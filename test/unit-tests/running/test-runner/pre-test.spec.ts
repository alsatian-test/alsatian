import { TestRunner } from "../../../../core/running/test-runner";
import { TestSet } from "../../../../core/test-set";
import { Expect, AsyncTest, TestCase, SpyOn, Setup, Teardown, Timeout } from "../../../../core/alsatian-core";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestBuilder } from "../../../builders/test-builder";
import { TestCaseBuilder } from "../../../builders/test-case-builder";
import { Promise } from "../../../../promise/promise";
import { TestOutputStream } from "../../../../core/test-output-stream";

export class PreTestTests {

   private _originalStdOut: any;
   private _originalProcessExit: any;

   @AsyncTest()
   public tapVersionHeaderOutput() {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];
      let testFixtureBuilder = new TestFixtureBuilder();
      let testBuilder = new TestBuilder();
      testBuilder.addTestCase(new TestCaseBuilder().build());
      testFixtureBuilder.addTest(testBuilder.build());
      testSet.testFixtures.push(testFixtureBuilder.build());

      return new Promise<void>((resolve, reject) => {
         let output = new TestOutputStream();
         SpyOn(output, "push");

         let testRunner = new TestRunner(output);

         testRunner.run(testSet).then(() => {
            Expect(output.push).toHaveBeenCalledWith("TAP version 13\n");
            resolve();
         })
         .catch((error: Error) => {
            reject(error);
         });
      });
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(5)
   @AsyncTest()
   public multipleTestFixtureWithSingleTestOutputsCorrectTestNumber(testFixtureCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
         let testFixtureBuilder = new TestFixtureBuilder();
         let testBuilder = new TestBuilder();
         testBuilder.addTestCase(new TestCaseBuilder().build());
         testFixtureBuilder.addTest(testBuilder.build());
         testSet.testFixtures.push(testFixtureBuilder.build());
      }

      return new Promise<void>((resolve, reject) => {
         let output = new TestOutputStream();
         SpyOn(output, "push");

         let testRunner = new TestRunner(output);

         testRunner.run(testSet).then(() => {
            Expect(output.push).toHaveBeenCalledWith("1.." + testFixtureCount + "\n");
            resolve();
         })
         .catch((error: Error) => {
            reject(error);
         });
      });
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
   public multipleTestFixtureWithMultipleTestsOutputsCorrectTestCount(testFixtureCount: number, testCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {

         let testFixtureBuilder = new TestFixtureBuilder();

         for (let j = 0; j < testCount; j++) {
            let testFunctionKey = "testFunction" + j;
            let testBuilder = new TestBuilder().withKey(testFunctionKey);
            testBuilder.addTestCase(new TestCaseBuilder().build());
            testFixtureBuilder.addTest(testBuilder.build());
         }

         testSet.testFixtures.push(testFixtureBuilder.build());
      }

      let resultPromise: any = {
         resolve: () => {

         },
         then: (callback: (testResults: Array<any>) => any) => {
            resultPromise.resolve = callback;
            return resultPromise;
         },
         catch: (error: Error) => {
         }
      };

      let output = new TestOutputStream();
      SpyOn(output, "push");

      let testRunner = new TestRunner(output);

      testRunner.run(testSet).then(() => {
         Expect(output.push).toHaveBeenCalledWith("1.." + (testFixtureCount * testCount) + "\n");
         resultPromise.resolve();
      });

      return resultPromise;
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
   public multipleTestFixtureWithMultipleTestsWithMultipleTestCasesOutputsCorrectTestCount(testFixtureCount: number, testCount: number, testCaseCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {

         let testFixtureBuilder = new TestFixtureBuilder();

         for (let j = 0; j < testCount; j++) {
            let testFunctionKey = "testFunction" + j;
            let testBuilder = new TestBuilder().withKey(testFunctionKey);
            testFixtureBuilder.addTest(testBuilder.build());

            for (let k = 0; k < testCaseCount; k++) {
               testBuilder.addTestCase(new TestCaseBuilder().build());
            }
         }

         testSet.testFixtures.push(testFixtureBuilder.build());
      }

      return new Promise<void>((resolve, reject) => {
         let output = new TestOutputStream();
         SpyOn(output, "push");

         let testRunner = new TestRunner(output);

         testRunner.run(testSet).then(() => {
            Expect(output.push).toHaveBeenCalledWith("1.." + (testFixtureCount * testCount * testCaseCount) + "\n");
            resolve();
         })
         .catch((error: Error) => {
            reject(error);
         });
      });
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(5)
   @AsyncTest()
   public testFixtureWithMultipleTestsAndSecondWithNoneOutputsCorrectTestNumber(testFixtureCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
         let testFixtureBuilder = new TestFixtureBuilder();
         let testBuilder = new TestBuilder();
         testBuilder.addTestCase(new TestCaseBuilder().build());
         testFixtureBuilder.addTest(testBuilder.build());
         testSet.testFixtures.push(testFixtureBuilder.build());
      }

      let testFixtureBuilder = new TestFixtureBuilder();
      testSet.testFixtures.push(testFixtureBuilder.build());

      return new Promise<void>((resolve, reject) => {
         let output = new TestOutputStream();
         SpyOn(output, "push");

         let testRunner = new TestRunner(output);

         testRunner.run(testSet).then(() => {
            Expect(output.push).toHaveBeenCalledWith("1.." + testFixtureCount + "\n");
            resolve();
         })
         .catch((error: Error) => {
            reject(error);
         });
      });
   }
}
