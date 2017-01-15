import { AsyncTest, Expect, MatchError, SpyOn, TestCase, TestOutputStream, TestRunner, TestSet } from "../../../../core/alsatian-core";
import { TestBuilder } from "../../../builders/test-builder";
import { TestCaseBuilder } from "../../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";

export class FixtureInfoTests {

   private static _getExpectedFixtureOutput(fixtureName: string): string {
      return `# FIXTURE ${fixtureName}\n`;
   }

   @AsyncTest()
   @TestCase("SomeFixtureName")
   @TestCase("AnotherFixture")
   public async outputsFixtureNameWithPassingTest(description: string) {
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

      let testRunner = new TestRunner(output);
      await testRunner.run(testSet);
      Expect(output.push).toHaveBeenCalledWith(FixtureInfoTests._getExpectedFixtureOutput(description));
      Expect(output.push).toHaveBeenCalledWith(`ok 1 ${test.description}\n`);
   }

   @AsyncTest()
   @TestCase("SomeFixtureName")
   @TestCase("AnotherFixture")
   public async outputsFixtureNameWithFailingTest(description: string) {
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

      let testRunner = new TestRunner(output);
      await testRunner.run(testSet);

      testSet.testFixtures.push(testFixture);
      Expect(output.push).toHaveBeenCalledWith(FixtureInfoTests._getExpectedFixtureOutput(description));
      Expect(output.push).toHaveBeenCalledWith(`not ok 1 ${test.description}\n`);
   }
}
