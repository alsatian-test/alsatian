import { Expect, TestCase, SpyOn, TestOutput, TestSet, AsyncTest, TestRunner, MatchError } from "../../../core/alsatian-core";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { OutputStreamBuilder } from "../../builders/output-stream-builder";
import { Promise } from "../../../promise/promise";

export class FixtureInfoTests {

   private static _getExpectedFixtureOutput(fixtureName: string): string {
      return `# FIXTURE ${fixtureName}\n`;
   }

   @AsyncTest()
   @TestCase("SomeFixtureName")
   @TestCase("AnotherFixture")
   public outputsFixtureNameWithPassingTest(description: string) {
      let writeCalls: Array<string> = [ ];

      let outputStream = new OutputStreamBuilder().build();
      SpyOn(outputStream, "write").andCall((s: string) => {
         writeCalls.push(s);
      });

      let output = new TestOutput(outputStream);

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
            Expect(writeCalls[2]).toBe(FixtureInfoTests._getExpectedFixtureOutput(description));
            Expect(writeCalls[3]).toBe(`ok 1 ${test.description}\n`);
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
      let writeCalls: Array<string> = [ ];

      let outputStream = new OutputStreamBuilder().build();
      SpyOn(outputStream, "write").andCall((s: string) => {
         writeCalls.push(s);
      });

      let output = new TestOutput(outputStream);

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
            Expect(writeCalls[2]).toBe(FixtureInfoTests._getExpectedFixtureOutput(description));
            Expect(writeCalls[3]).toBe(`not ok 1 ${test.description}\n`);
            resolve();
         })
         .catch((error: Error) => {
            reject(error);
         });

      });
   }

}
