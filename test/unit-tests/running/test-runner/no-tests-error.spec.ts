import { TestRunner } from "../../../../core/running/test-runner";
import { TestSet } from "../../../../core/test-set";
import { Expect, AsyncTest, TestCase, SpyOn, Setup, Teardown } from "../../../../core/alsatian-core";
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

   @AsyncTest("empty test fixture throws no tests error")
   public async emptyTestFixturesThrowsError() {
      let testSet = <TestSet>{};

      (<any> testSet).testFixtures = [];

      let testRunner = new TestRunner();

      let error: Error;

      try {
        await testRunner.run(testSet);
      }
      catch (e) {
        error = e;
      }

      Expect(error).toBeDefined();
      Expect(error).not.toBeNull();
      Expect(error.constructor).toBe(Error);
      Expect(error.message).toBe("no tests to run.");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(13)
   @AsyncTest("one test fixture with multiple empty tests throws no tests error")
   public async testFixtureWithEmptyTestsOutputsNoTestError(testCount: number) {
      let testSet = <TestSet>{};

      (<any> testSet).testFixtures = [];

      let testFixtureBuilder = new TestFixtureBuilder();

      for (let i = 0; i < testCount; i++) {
        testFixtureBuilder.addTest(new TestBuilder().build());
      }

      testSet.testFixtures.push(testFixtureBuilder.build());

      let testRunner = new TestRunner();

      let error: Error;

      try {
        await testRunner.run(testSet);
      }
      catch (e) {
        error = e;
      }

      Expect(error).toBeDefined();
      Expect(error).not.toBeNull();
      Expect(error.constructor).toBe(Error);
      Expect(error.message).toBe("no tests to run.");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(13)
   @AsyncTest("multiple test fixtures with no tests throws no tests error")
   public async multipleTestFixtureWithEmptyTestOutputsNoTestError(testFixtureCount: number) {
      let testSet = <TestSet>{};

      (<any> testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
        testSet.testFixtures.push(new TestFixtureBuilder().build());
      }

      let testRunner = new TestRunner();

      let error: Error;

      try {
        await testRunner.run(testSet);
      }
      catch (e) {
        error = e;
      }

      Expect(error).toBeDefined();
      Expect(error).not.toBeNull();
      Expect(error.constructor).toBe(Error);
      Expect(error.message).toBe("no tests to run.");
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
   @AsyncTest("multiple test fixtures with multiple empty tests throws no tests error")
   public async multipleTestFixtureWithMultipleEmptyTestOutputsNoTestError(testFixtureCount: number, testCount: number) {
      let testSet = <TestSet>{};

      (<any> testSet).testFixtures = [];

      for (let i = 0; i < testFixtureCount; i++) {
        let testFixtureBuilder = new TestFixtureBuilder();

        for (let j = 0; j < testCount; j++) {
          testFixtureBuilder.addTest(new TestBuilder().build());
        }

         testSet.testFixtures.push(testFixtureBuilder.build());
      }

      let testRunner = new TestRunner();

      let error: Error;

      try {
        await testRunner.run(testSet);
      }
      catch (e) {
        error = e;
      }

      Expect(error).toBeDefined();
      Expect(error).not.toBeNull();
      Expect(error.constructor).toBe(Error);
      Expect(error.message).toBe("no tests to run.");
   }
}
