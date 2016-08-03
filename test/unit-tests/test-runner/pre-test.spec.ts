import { TestRunner } from "../../../core/test-runner";
import { TestSet } from "../../../core/test-set";
import { Expect, AsyncTest, TestCase, SpyOn, Setup, Teardown } from "../../../core/alsatian-core";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";

export class PreTestTests {

  private _originalStdOut: any;
  private _originalProcessExit: any;

   @Setup
   private _spyProcess() {
     this._originalProcessExit = process.exit;
     this._originalStdOut = process.stdout.write;

     SpyOn(process, "exit").andStub();
     SpyOn(process.stdout, "write").andStub();
   }

   @Teardown
   private _resetProcess() {
     process.exit = this._originalProcessExit;
     process.stdout.write = this._originalStdOut;
   }

   @AsyncTest()
   public tapVersionHeaderOutput() {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];
      let testFixtureBuilder = new TestFixtureBuilder();
      let testBuilder = new TestBuilder();
      testBuilder.addTestCase(new TestCaseBuilder().build());
      testFixtureBuilder.addTest(testBuilder.build());
      testSet.testFixtures.push(testFixtureBuilder.build());

      let resultPromise: any = {
        resolve: () => {

        },
        then: (callback: (testResults: Array<any>) => any) => {
          resultPromise.resolve = callback;
          return resultPromise;
        },
        catch: (error: Error) => {
           return resultPromise;
        }
     };

      let testRunner = new TestRunner();

      testRunner.run(testSet).then.call(testRunner, () => {
         Expect(process.stdout.write).toHaveBeenCalledWith("TAP version 13\n");
         resultPromise.resolve();
      });

      return resultPromise;
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(13)
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

      let testRunner = new TestRunner();

      testRunner.run(testSet).then(() => {
         Expect(process.stdout.write).toHaveBeenCalledWith("1.." + testFixtureCount + "\n");
         resultPromise.resolve();
      });

      return resultPromise;
   }

   @TestCase(1, 1)
   @TestCase(1, 2)
   @TestCase(1, 13)
   @TestCase(2, 1)
   @TestCase(2, 2)
   @TestCase(2, 13)
   @TestCase(13, 1)
   @TestCase(13, 2)
   @TestCase(13, 13)
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

      let testRunner = new TestRunner();

      testRunner.run(testSet).then(() => {
         Expect(process.stdout.write).toHaveBeenCalledWith("1.." + (testFixtureCount * testCount) + "\n");
         resultPromise.resolve();
      });

      return resultPromise;
   }

   @TestCase(1, 1, 1)
   @TestCase(1, 2, 1)
   @TestCase(1, 13, 1)
   @TestCase(2, 1, 1)
   @TestCase(2, 2, 1)
   @TestCase(2, 13, 1)
   @TestCase(13, 1, 1)
   @TestCase(13, 2, 1)
   @TestCase(13, 13, 1)
   @TestCase(1, 1, 2)
   @TestCase(1, 2, 2)
   @TestCase(1, 13, 2)
   @TestCase(2, 1, 2)
   @TestCase(2, 2, 2)
   @TestCase(2, 13, 2)
   @TestCase(13, 1, 2)
   @TestCase(13, 2, 2)
   @TestCase(13, 13, 2)
   @TestCase(1, 1, 13)
   @TestCase(1, 2, 13)
   @TestCase(1, 13, 13)
   @TestCase(2, 1, 13)
   @TestCase(2, 2, 13)
   @TestCase(2, 13, 13)
   @TestCase(13, 1, 13)
   @TestCase(13, 2, 13)
   @TestCase(13, 13, 13)
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

      let testRunner = new TestRunner();

      testRunner.run(testSet).then(() => {
         Expect(process.stdout.write).toHaveBeenCalledWith("1.." + (testFixtureCount * testCount * testCaseCount) + "\n");
         resultPromise.resolve();
      });

      return resultPromise;
   }
}
