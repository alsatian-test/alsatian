import { Expect, TestCase, SpyOn, TestOutputStream, TestSet, AsyncTest, TestRunner, MatchError } from "../../../core/alsatian-core";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { Promise } from "../../../promise/promise";

export class FixtureInfoTests {

   private static _getExpectedFixtureOutput(fixtureName: string): string {
      return `# FIXTURE ${fixtureName}\n`;
   }

   @AsyncTest()
   @TestCase("SomeFixtureName")
   @TestCase("AnotherFixture")
   public outputsFixtureNameWithPassingTest(description: string) {
      let output = new TestOutputStream();
      SpyOn(output, "push");

      let testSet = <TestSet>{
         testFixtures: []
      };

      let test = new TestBuilder()
      .withKey("test")
      .addTestCase(new TestCaseBuilder().build())
      .build();

      let testFixture = new TestFixtureBuilder()
      .withFixture({ test: () => { }})
      .withDescription(description)
      .addTest(test)
      .build();

      testSet.testFixtures.push(testFixture);

      return new Promise<void>((resolve, reject) => {

         let testRunner = new TestRunner(output);

         testRunner.run(testSet).then(() => {
            // it should output version, then plan, then fixture, then test
            Expect(output.push).toHaveBeenCalledWith(FixtureInfoTests._getExpectedFixtureOutput(description));
            Expect(output.push).toHaveBeenCalledWith(`ok 1 ${test.description}\n`);
            resolve();
         })
         .catch((error: Error) => {
            reject(error);
         });

      });
   }

   @AsyncTest()
   @TestCase("SomeFixtureName")
   @TestCase("AnotherFixture")
   public outputsFixtureNameWithFailingTest(description: string) {
      let output = new TestOutputStream();
      SpyOn(output, "push");

      let testSet = <TestSet>{
         testFixtures: []
      };

      let test = new TestBuilder()
      .withKey("test")
      .addTestCase(new TestCaseBuilder().build())
      .build();

      let testFixture = new TestFixtureBuilder()
      .withFixture({ test: () => { throw new MatchError("nothing", "something", "expected nothing to be something."); }})
      .addTest(test)
      .withDescription(description)
      .build();

      testSet.testFixtures.push(testFixture);

      return new Promise<void>((resolve, reject) => {

         let testRunner = new TestRunner(output);

         testRunner.run(testSet).then(() => {
            // it should output version, then plan, then fixture, then test
            Expect(output.push).toHaveBeenCalledWith(FixtureInfoTests._getExpectedFixtureOutput(description));
            Expect(output.push).toHaveBeenCalledWith(`not ok 1 ${test.description}\n`);
            resolve();
         })
         .catch((error: Error) => {
            reject(error);
         });

      });
   }
}
