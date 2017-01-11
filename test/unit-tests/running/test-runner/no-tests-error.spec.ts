import { TestRunner } from "../../../../core/running/test-runner";
import { TestSet } from "../../../../core/test-set";
import { Expect, Test, TestCase, SpyOn, Setup, Teardown, FocusTest } from "../../../../core/alsatian-core";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestBuilder } from "../../../builders/test-builder";

export class NotestsErrorTests {

  private _originalStdErr: any;
  private _originalProcessExit: any;

   @Setup
   private _spyProcess() {
     this._originalProcessExit = process.exit;
     this._originalStdErr = process.stderr.write;

     SpyOn(process, "exit").andStub();
     SpyOn(process.stderr, "write").andStub();
   }

   @Teardown
   private _resetProcess() {
     process.exit = this._originalProcessExit;
     process.stderr.write = this._originalStdErr;
   }

   @Test()
   public emptyTestFixturesThrowsError() {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      let testRunner = new TestRunner();

      Expect(async () => await testRunner.run(testSet)).toThrowError(Error, "no tests to run.");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(13)
   public testFixtureWithEmptyTestsOutputsNoTestError(testCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      let testFixtureBuilder = new TestFixtureBuilder();

      for (let i = 0; i < testCount; i++) {
        testFixtureBuilder.addTest(new TestBuilder().build());
      }

      testSet.testFixtures.push(testFixtureBuilder.build());

      let testRunner = new TestRunner();

      Expect(() => testRunner.run(testSet)).toThrowError(Error, "no tests to run.");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(13)
   public multipleTestFixtureWithEmptyTestOutputsNoTestError(testFixtureCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
        testSet.testFixtures.push(new TestFixtureBuilder().build());
      }

      let testRunner = new TestRunner();

      Expect(() => testRunner.run(testSet)).toThrowError(Error, "no tests to run.");
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
   public multipleTestFixtureWithMultipleEmptyTestOutputsNoTestError(testFixtureCount: number, testCount: number) {
      let testSet = <TestSet>{};

      (<any>testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
        let testFixtureBuilder = new TestFixtureBuilder();

        for (let j = 0; j < testCount; j++) {
          testFixtureBuilder.addTest(new TestBuilder().build());
        }

         testSet.testFixtures.push(testFixtureBuilder.build());
      }

      let testRunner = new TestRunner();

      Expect(() => testRunner.run(testSet)).toThrowError(Error, "no tests to run.");
   }
}
