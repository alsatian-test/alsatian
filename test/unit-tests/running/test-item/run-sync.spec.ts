import { AsyncTest, Expect, METADATA_KEYS, SpyOn, Timeout } from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors";
import { TestItem } from "../../../../core/running/test-item";
import { Promise } from "../../../../promise/promise";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestSetBuilder } from "../../../builders/test-set-builder";

export class TestItemRunSyncTests {

   @AsyncTest()
   public successfulSyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();
      const testFixture = new TestFixtureBuilder().addTest(test).build();

      const testItem = new TestItem(testFixture, test, test.testCases[0]);

      return new Promise((resolve, reject) => {
         testItem.run(500)
         .then(result => {
            Expect(result.test).toBe(test);
            Expect(result.error).toBe(undefined);
            resolve();
         })
         .catch(error => {
            reject(error);
         });
      });
   }

   @AsyncTest()
   public ignoreSyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();
      test.ignored = true;
      const testFixture = new TestFixtureBuilder().addTest(test).build();

      const testItem = new TestItem(testFixture, test, test.testCases[0]);

      return new Promise((resolve, reject) => {
         testItem.run(500)
         .then(result => {
            Expect(result.test).toBe(test);
            Expect(result.error).toBe(undefined);
            resolve();
         })
         .catch(error => {
            reject(error);
         });
      });
   }

   @AsyncTest()
   public failSyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();

      const error = new MatchError("something", "nothing", "expected something to be nothing.");

      const testFixture = new TestFixtureBuilder()
                                 .withFixture({
                                    testFunction: () => { throw error; }
                                 }).addTest(test)
                                 .build();

      const testItem = new TestItem(testFixture, test, test.testCases[0]);

      return new Promise((resolve, reject) => {
         testItem.run(500)
         .then(result => {
            Expect(result.test).toBe(test);
            Expect(result.error).toBe(error);
            resolve();
         })
         .catch(error => {
            reject(error);
         });
      });
   }

   @AsyncTest()
   public errorSyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();

      const error = new Error("something awful happened.");

      const testFixture = new TestFixtureBuilder()
                                 .withFixture({
                                    testFunction: () => { throw error; }
                                 }).addTest(test)
                                 .build();

      const testItem = new TestItem(testFixture, test, test.testCases[0]);

      return new Promise((resolve, reject) => {
         testItem.run(500)
         .then(result => {
            Expect(result.test).toBe(test);
            Expect(result.error).toBe(error);
            resolve();
         })
         .catch(error => {
            reject(error);
         });
      });
   }
}
