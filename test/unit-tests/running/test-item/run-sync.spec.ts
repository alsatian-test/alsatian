import { AsyncTest, Timeout, Expect, SpyOn, METADATA_KEYS, IgnoreTests } from "../../../../core/alsatian-core";
import { TestItem } from "../../../../core/running/test-item";
import { TestSetBuilder } from "../../../builders/test-set-builder";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { MatchError } from "../../../../core/errors";

export class TestItemRunSyncTests {

   @AsyncTest()
   public async successfulSyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();
      const testFixture = new TestFixtureBuilder().addTest(test).build();

      const testItem = new TestItem(testFixture, test, test.testCases[0]);
      
      try {
        await testItem.run(500);
      }
      catch (e) {
        var error = e;
      }

      Expect(error).toBe(undefined);
   }

   @AsyncTest()
   public async ignoreSyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();
      test.ignored = true;
      const testFixture = new TestFixtureBuilder().addTest(test).build();

      const testItem = new TestItem(testFixture, test, test.testCases[0]);
      
      try {
        await testItem.run(500);
      }
      catch (e) {
        var error = e;
      }

      Expect(error).toBe(undefined);
   }

   @AsyncTest()
   public async failSyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();

      const expectedError = new MatchError("something", "nothing", "expected something to be nothing.");

      const testFixture = new TestFixtureBuilder()
                                 .withFixture({
                                    testFunction: () => { throw expectedError; }
                                 }).addTest(test)
                                 .build();

      const testItem = new TestItem(testFixture, test, test.testCases[0]);
      
      try {
        await testItem.run(500);
      }
      catch (e) {
        var error = e;
      }

      Expect(error).toBe(expectedError);
   }

   @AsyncTest()
   public async errorSyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();

      const expectedError = new Error("something awful happened.");

      const testFixture = new TestFixtureBuilder()
                                 .withFixture({
                                    testFunction: () => { throw expectedError; }
                                 }).addTest(test)
                                 .build();

      const testItem = new TestItem(testFixture, test, test.testCases[0]);
      
      try {
        await testItem.run(500);
      }
      catch (e) {
        var error = e;
      }

      Expect(error).toBe(expectedError);
   }
}
