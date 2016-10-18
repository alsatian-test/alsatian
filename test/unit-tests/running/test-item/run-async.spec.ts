import { AsyncTest, Timeout, Expect, SpyOn, METADATA_KEYS } from "../../../../core/alsatian-core";
import { TestItem } from "../../../../core/running/test-item";
import { TestSetBuilder } from "../../../builders/test-set-builder";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { Promise } from "../../../../promise/promise";
import { MatchError } from "../../../../core/_errors";

export class TestItemRunAsyncTests {

   @AsyncTest()
   public successfulAsyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();
      test.isAsync = true;

      const testFixture = new TestFixtureBuilder()
                                 .withFixture({
                                    testFunction: () => new Promise((resolve, reject) => {
                                       resolve();
                                    })
                                 })
                                 .addTest(test)
                                 .build();

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
   public ignoreAsyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();
      test.ignored = true;
      test.isAsync = true;

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
   public failAsyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();
      test.isAsync = true;

      const error = new MatchError("something", "nothing", "expected something to be nothing.");

      const testFixture = new TestFixtureBuilder()
                                 .withFixture({
                                    testFunction: () => new Promise((resolve, reject) => {
                                       reject(error);
                                    })
                                 })
                                 .addTest(test)
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
   public errorAsyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();
      test.isAsync = true;

      const error = new Error("something awful happened.");

      const testFixture = new TestFixtureBuilder()
                                 .withFixture({
                                    testFunction: () => new Promise((resolve, reject) => {
                                       reject(error);
                                    })
                                 })
                                 .addTest(test)
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
   public testErrorAsyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();
      test.isAsync = true;

      const error = new Error("something awful happened.");

      const testFixture = new TestFixtureBuilder()
                                 .withFixture({
                                    testFunction: () => {
                                       throw error;
                                    }
                                 })
                                 .addTest(test)
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
   public timeoutAsyncTest() {
      const test = new TestBuilder().withTestCaseCount(1).build();
      test.isAsync = true;

      const testFixture = new TestFixtureBuilder()
                                 .withFixture({
                                    testFunction: () => new Promise((resolve, reject) => {
                                       setTimeout(resolve, 100);
                                    })
                                 }).addTest(test)
                                 .build();

      const testItem = new TestItem(testFixture, test, test.testCases[0]);

      return new Promise((resolve, reject) => {
         testItem.run(50)
         .then(result => {
            Expect(result.test).toBe(test);
            Expect(result.error).toBeDefined();
            Expect(result.error.message).toBe("The test exceeded the given timeout of 50ms.");
            resolve();
         })
         .catch(error => {
            reject(error);
         });
      });
   }
}
