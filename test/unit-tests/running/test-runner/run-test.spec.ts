import { AsyncTest, Timeout, Expect, SpyOn, METADATA_KEYS } from "../../../../core/alsatian-core";
import { TestRunner } from "../../../../core/running/test-runner";
import { TestSetBuilder } from "../../../builders/test-set-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";
import { TestBuilder } from "../../../builders/test-builder";
import { TestOutputStream } from "../../../../core/test-output-stream";
import { Promise } from "../../../../promise/promise";
import "reflect-metadata";

export class RunTestTests {

   @AsyncTest()
   public singlePassingTestRunsSuccessfully() {

      const test = new TestBuilder().withTestCaseCount(1).build();

      const testFixture = new TestFixtureBuilder()
                                 .addTest(test)
                                 .build();

      const testSet = new TestSetBuilder()
                           .addTestFixture(testFixture)
                           .build();

      const outputStream = new TestOutputStream();
      SpyOn(outputStream, "push");

      const testRunner = new TestRunner(outputStream);

      return new Promise((resolve, reject) => {
         testRunner.run(testSet)
            .then(result => {
               Expect(outputStream.push).toHaveBeenCalledWith("ok 1 Test Function\n");
               resolve();
            })
            .catch(error => {
               reject(error);
            });
      });
   }

   @AsyncTest()
   @Timeout(600)
   public singleTestTakes501msFails() {

      const test = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("testFunction")
                        .withIsAsync(true)
                        .build();

      const fixtureObject = {
         testFunction: () => {
            return new Promise((resolve, reject) => setTimeout(() => resolve(), 501));
         }
      };

      const testFixture = new TestFixtureBuilder()
                                 .withFixture(fixtureObject)
                                 .addTest(test)
                                 .build();

      const testSet = new TestSetBuilder()
                           .addTestFixture(testFixture)
                           .build();

      const outputStream = new TestOutputStream();
      SpyOn(outputStream, "push");

      const testRunner = new TestRunner(outputStream);

      return new Promise((resolve, reject) => {
         testRunner.run(testSet)
            .then(result => {
               Expect(outputStream.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
               resolve();
            })
            .catch(error => {
               reject(error);
            });
      });
   }

   @AsyncTest()
   public singleTestTakes100msWith50msTimeoutFails() {

      const test = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("testFunction")
                        .withIsAsync(true)
                        .build();

      const fixtureObject = {
         testFunction: () => {
            return new Promise((resolve, reject) => setTimeout(() => resolve(), 100));
         }
      };

      const testFixture = new TestFixtureBuilder()
                                 .withFixture(fixtureObject)
                                 .addTest(test)
                                 .build();

      const testSet = new TestSetBuilder()
                           .addTestFixture(testFixture)
                           .build();

      const outputStream = new TestOutputStream();
      SpyOn(outputStream, "push");

      const testRunner = new TestRunner(outputStream);

      return new Promise((resolve, reject) => {
         testRunner.run(testSet, 50)
            .then(result => {
               Expect(outputStream.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
               resolve();
            })
            .catch(error => {
               reject(error);
            });
      });
   }

   @AsyncTest()
   public singleTestThrowsErrorFails() {

      const test = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("testFunction")
                        .build();

      const fixtureObject = {
         setupFunction: () => { throw new Error("setup failed"); },
         testFunction: () => {
            throw new Error("everything has blown up");
         }
      };

      Reflect.defineMetadata(METADATA_KEYS.TEARDOWN, [ "setupFunction" ], fixtureObject);

      const testFixture = new TestFixtureBuilder()
                                 .withFixture(fixtureObject)
                                 .addTest(test)
                                 .build();

      const testSet = new TestSetBuilder()
                           .addTestFixture(testFixture)
                           .build();

      const outputStream = new TestOutputStream();
      SpyOn(outputStream, "push");

      const testRunner = new TestRunner(outputStream);

      return new Promise((resolve, reject) => {
         testRunner.run(testSet)
            .then(result => {
               Expect(outputStream.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
               resolve();
            })
            .catch(error => {
               reject(error);
            });
      });
   }

   @AsyncTest()
   public twoPassingTestsRunsSuccessfully() {

      const firstTest = new TestBuilder().withTestCaseCount(1).build();
      const secondTest = new TestBuilder().withTestCaseCount(1).build();

      const testFixture = new TestFixtureBuilder()
                                 .addTest(firstTest)
                                 .addTest(secondTest)
                                 .build();

      const testSet = new TestSetBuilder()
                           .addTestFixture(testFixture)
                           .build();

      const outputStream = new TestOutputStream();
      SpyOn(outputStream, "push");

      const testRunner = new TestRunner(outputStream);

      return new Promise((resolve, reject) => {
         testRunner.run(testSet)
            .then(result => {
               Expect(outputStream.push).toHaveBeenCalledWith("ok 1 Test Function\n");
               Expect(outputStream.push).toHaveBeenCalledWith("ok 2 Test Function\n");
               resolve();
            })
            .catch(error => {
               reject(error);
            });
      });
   }

   @AsyncTest()
   @Timeout(1000)
   public twoTestsFirstTakes501msFails() {

      const firstTest = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("firstTestFunction")
                        .withIsAsync(true)
                        .build();

      const secondTest = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("secondTestFunction")
                        .withIsAsync(true)
                        .build();

      const fixtureObject = {
         firstTestFunction: () => {
            return new Promise((resolve, reject) => setTimeout(() => resolve(), 501));
         },
         secondTestFunction: () => {
            return new Promise((resolve, reject) => setTimeout(() => resolve(), 10));
         }
      };

      const testFixture = new TestFixtureBuilder()
                                 .withFixture(fixtureObject)
                                 .addTest(firstTest)
                                 .addTest(secondTest)
                                 .build();

      const testSet = new TestSetBuilder()
                           .addTestFixture(testFixture)
                           .build();

      const outputStream = new TestOutputStream();
      SpyOn(outputStream, "push");

      const testRunner = new TestRunner(outputStream);

      return new Promise((resolve, reject) => {
         testRunner.run(testSet)
            .then(result => {
               Expect(outputStream.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
               Expect(outputStream.push).toHaveBeenCalledWith("ok 2 Test Function\n");
               resolve();
            })
            .catch(error => {
               reject(error);
            });
      });
   }

   @AsyncTest()
   @Timeout(1000)
   public twoTestsSecondTakes501msFails() {

      const firstTest = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("firstTestFunction")
                        .withIsAsync(true)
                        .build();

      const secondTest = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("secondTestFunction")
                        .withIsAsync(true)
                        .build();

      const fixtureObject = {
         firstTestFunction: () => {
            return new Promise((resolve, reject) => setTimeout(() => resolve(), 10));
         },
         secondTestFunction: () => {
            return new Promise((resolve, reject) => setTimeout(() => resolve(), 501));
         }
      };

      const testFixture = new TestFixtureBuilder()
                                 .withFixture(fixtureObject)
                                 .addTest(firstTest)
                                 .addTest(secondTest)
                                 .build();

      const testSet = new TestSetBuilder()
                           .addTestFixture(testFixture)
                           .build();

      const outputStream = new TestOutputStream();
      SpyOn(outputStream, "push");

      const testRunner = new TestRunner(outputStream);

      return new Promise((resolve, reject) => {
         testRunner.run(testSet)
            .then(result => {
               Expect(outputStream.push).toHaveBeenCalledWith("ok 1 Test Function\n");
               Expect(outputStream.push).toHaveBeenCalledWith("not ok 2 Test Function\n");
               resolve();
            })
            .catch(error => {
               reject(error);
            });
      });
   }

   @AsyncTest()
   public twoTestsFirstTakes100msWith50msTimeoutFails() {

      const firstTest = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("firstTestFunction")
                        .withIsAsync(true)
                        .build();

      const secondTest = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("secondTestFunction")
                        .withIsAsync(true)
                        .build();

      const fixtureObject = {
         firstTestFunction: () => {
            return new Promise((resolve, reject) => setTimeout(() => resolve(), 100));
         },
         secondTestFunction: () => {
            return new Promise((resolve, reject) => setTimeout(() => resolve(), 10));
         }
      };

      const testFixture = new TestFixtureBuilder()
                                 .withFixture(fixtureObject)
                                 .addTest(firstTest)
                                 .addTest(secondTest)
                                 .build();

      const testSet = new TestSetBuilder()
                           .addTestFixture(testFixture)
                           .build();

      const outputStream = new TestOutputStream();
      SpyOn(outputStream, "push");

      const testRunner = new TestRunner(outputStream);

      return new Promise((resolve, reject) => {
         testRunner.run(testSet, 50)
            .then(result => {
               Expect(outputStream.push).toHaveBeenCalledWith("not ok 1 Test Function\n");
               Expect(outputStream.push).toHaveBeenCalledWith("ok 2 Test Function\n");
               resolve();
            })
            .catch(error => {
               reject(error);
            });
      });
   }

   @AsyncTest()
   public twoTestsSecondTakes100msWith50msTimeoutFails() {

      const firstTest = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("firstTestFunction")
                        .withIsAsync(true)
                        .build();

      const secondTest = new TestBuilder()
                        .withTestCaseCount(1)
                        .withKey("secondTestFunction")
                        .withIsAsync(true)
                        .build();

      const fixtureObject = {
         firstTestFunction: () => {
            return new Promise((resolve, reject) => setTimeout(() => resolve(), 10));
         },
         secondTestFunction: () => {
            return new Promise((resolve, reject) => setTimeout(() => resolve(), 100));
         }
      };

      const testFixture = new TestFixtureBuilder()
                                 .withFixture(fixtureObject)
                                 .addTest(firstTest)
                                 .addTest(secondTest)
                                 .build();

      const testSet = new TestSetBuilder()
                           .addTestFixture(testFixture)
                           .build();

      const outputStream = new TestOutputStream();
      SpyOn(outputStream, "push");

      const testRunner = new TestRunner(outputStream);

      return new Promise((resolve, reject) => {
         testRunner.run(testSet, 50)
            .then(result => {
               Expect(outputStream.push).toHaveBeenCalledWith("ok 1 Test Function\n");
               Expect(outputStream.push).toHaveBeenCalledWith("not ok 2 Test Function\n");
               resolve();
            })
            .catch(error => {
               reject(error);
            });
      });
   }
}
