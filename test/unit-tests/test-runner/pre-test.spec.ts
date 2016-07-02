import { TestRunner } from "../../../core/test-runner";
import { TestSet } from "../../../core/test-set";
import { Expect, Test, TestCase, SpyOn, Setup, Teardown } from "../../../core/alsatian-core";

export class PreTestTests {

  private _originalStdOut: any;
  private _originalProcessExit: any;

   @Setup
   private _spyProcess() {
     this._originalProcessExit = process.exit;
     this._originalStdOut = process.stdout.write;

     SpyOn(process, "exit").andStub();
     let stdOutSpy = SpyOn(process.stdout, "write");
     stdOutSpy.andStub();
   }

   @Teardown
   private _resetProcess() {
     process.exit = this._originalProcessExit;
     process.stdout.write = this._originalStdOut;
   }

   @Test()
   public tapVersionHeaderOutput() {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];
      testSet.testFixtures.push({
        fixture: {
          testFunction: () => {}
        },
        tests: [ {
          key: "testFunction",
          testCases: [[]]
        }]
      });

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      Expect(process.stdout.write).toHaveBeenCalledWith("TAP version 13\n");

   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(13)
   public multiplTestFixtureWithSingleTestOutputsCorrectTestNumber(testFixtureCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
        testSet.testFixtures.push({
          fixture: {
            testFunction: () => {}
          },
          tests: [ {
            key: "testFunction",
            testCases: [[]]
          }]
        });
      }

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      Expect(process.stdout.write).toHaveBeenCalledWith("1.." + testFixtureCount + "\n");
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
   public multiplTestFixtureWithMultipleTestsOutputsCorrectTestCount(testFixtureCount: number, testCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
        testSet.testFixtures.push({
          fixture: {
          },
          tests: []
        });

        for (let j = 0; j < testCount; j++) {
          let testFunctionKey = "testFunction" + j;
          testSet.testFixtures[i].fixture[testFunctionKey];
          testSet.testFixtures[i].tests.push({
            key: testFunctionKey,
            testCases: [[]]
          });
        }
      }

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      Expect(process.stdout.write).toHaveBeenCalledWith("1.." + (testFixtureCount * testCount) + "\n");
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
   public multiplTestFixtureWithMultipleTestsWithMultipleTestCasesOutputsCorrectTestCount(testFixtureCount: number, testCount: number, testCaseCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
        testSet.testFixtures.push({
          fixture: {
          },
          tests: []
        });

        for (let j = 0; j < testCount; j++) {
          let testFunctionKey = "testFunction" + j;
          testSet.testFixtures[i].fixture[testFunctionKey];
          testSet.testFixtures[i].tests.push({
            key: testFunctionKey,
            testCases: []
          });

          for (let k = 0; k < testCaseCount; k++) {
            testSet.testFixtures[i].tests[j].testCases.push({
              arguments: [ i, j , k ]
            });
          }
        }
      }

      let testRunner = new TestRunner();

      testRunner.run(testSet);

      Expect(process.stdout.write).toHaveBeenCalledWith("1.." + (testFixtureCount * testCount * testCaseCount) + "\n");
   }
}
