import { TestCase, Test, Expect } from "../../../core/alsatian-core";
import { TestPlan } from "../../../core/running/test-plan";
import { TestSetBuilder } from "../../builders/test-set-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestBuilder } from "../../builders/test-builder";

export class TestPlanTests {

   @TestCase(1, 1, 1)
   @TestCase(2, 1, 1)
   @TestCase(1, 2, 1)
   @TestCase(2, 2, 1)
   @TestCase(1, 1, 2)
   @TestCase(2, 1, 2)
   @TestCase(1, 2, 2)
   @TestCase(2, 2, 2)
   public correctNumberOfTestItemsAdded(testFixtureCount: number, testCount: number, testCaseCount: number) {

      const testSetBuilder = new TestSetBuilder();

      for (let i = 0; i < testFixtureCount; i++) {

         const testFixtureBuilder = new TestFixtureBuilder();

         for (let j = 0; j < testCount; j++) {
            const test = new TestBuilder().withTestCaseCount(testCaseCount).build();
            testFixtureBuilder.addTest(test);
         }

         testSetBuilder.addTestFixture(testFixtureBuilder.build());
      }
      const testSet = testSetBuilder.build();

      const testPlan = new TestPlan(testSet);

      Expect(testPlan.testItems.length).toBe(testFixtureCount * testCount * testCaseCount);
   }


   @TestCase(1, 1, 1)
   @TestCase(2, 1, 1)
   @TestCase(1, 2, 1)
   @TestCase(2, 2, 1)
   @TestCase(1, 1, 2)
   @TestCase(2, 1, 2)
   @TestCase(1, 2, 2)
   @TestCase(2, 2, 2)
   public allTestFixturesAddedToTestItems(testFixtureCount: number, testCount: number, testCaseCount: number) {

      const testSetBuilder = new TestSetBuilder();

      for (let i = 0; i < testFixtureCount; i++) {

         const testFixtureBuilder = new TestFixtureBuilder();

         for (let j = 0; j < testCount; j++) {
            const test = new TestBuilder().withTestCaseCount(testCaseCount).build();
            testFixtureBuilder.addTest(test);
         }

         testSetBuilder.addTestFixture(testFixtureBuilder.build());
      }
      const testSet = testSetBuilder.build();

      const testPlan = new TestPlan(testSet);

      testSet.testFixtures.forEach(testFixture => {
         testFixture.tests.forEach(test => {
            test.testCases.forEach(testCase => {
               Expect(testPlan.testItems.filter(testItem => testItem.test === test
                                                         && testItem.testCase === testCase).length).toBe(1);
            });
         });
      });
   }

   @Test()
   public onlyFocussedFirstTestAddedToTestItems() {

      const testFixtureBuilder = new TestFixtureBuilder();

      const firstTest = new TestBuilder().withTestCaseCount(1).build();
      firstTest.focussed = true;

      testFixtureBuilder.addTest(firstTest);

      const secondTest = new TestBuilder().withTestCaseCount(1).build();

      testFixtureBuilder.addTest(secondTest);

      const testSet = new TestSetBuilder().addTestFixture(testFixtureBuilder.build()).build();

      const testPlan = new TestPlan(testSet);

      Expect(testPlan.testItems.length).toBe(1);
      Expect(testPlan.testItems[0].test).toBe(firstTest);
      Expect(testPlan.testItems[0].testCase).toBe(firstTest.testCases[0]);
   }

   @Test()
   public onlyFocussedSecondTestAddedToTestItems() {

      const testFixtureBuilder = new TestFixtureBuilder();

      const firstTest = new TestBuilder().withTestCaseCount(1).build();

      testFixtureBuilder.addTest(firstTest);

      const secondTest = new TestBuilder().withTestCaseCount(1).build();
      secondTest.focussed = true;

      testFixtureBuilder.addTest(secondTest);

      const testSet = new TestSetBuilder().addTestFixture(testFixtureBuilder.build()).build();

      const testPlan = new TestPlan(testSet);

      Expect(testPlan.testItems.length).toBe(1);
      Expect(testPlan.testItems[0].test).toBe(secondTest);
      Expect(testPlan.testItems[0].testCase).toBe(secondTest.testCases[0]);
   }

   @Test()
   public onlyFocussedFirstTestFixtureAddedToTestItems() {

      const firstTest = new TestBuilder().withTestCaseCount(1).build();
      const secondTest = new TestBuilder().withTestCaseCount(1).build();

      const firstTestFixture = new TestFixtureBuilder()
                                    .addTest(firstTest)
                                    .addTest(secondTest)
                                    .build();

      firstTestFixture.focussed = true;

      const secondTestFixture = new TestFixtureBuilder()
                                    .addTest(new TestBuilder().build())
                                    .addTest(new TestBuilder().build())
                                    .build();

      const testSet = new TestSetBuilder()
                           .addTestFixture(firstTestFixture)
                           .addTestFixture(secondTestFixture)
                           .build();

      const testPlan = new TestPlan(testSet);

      Expect(testPlan.testItems.length).toBe(2);
      Expect(testPlan.testItems[0].test).toBe(firstTest);
      Expect(testPlan.testItems[0].testCase).toBe(firstTest.testCases[0]);
      Expect(testPlan.testItems[1].test).toBe(secondTest);
      Expect(testPlan.testItems[1].testCase).toBe(secondTest.testCases[0]);
   }

   @Test()
   public onlyFocussedSecondTestFixtureAddedToTestItems() {

      const firstTestFixture = new TestFixtureBuilder()
                                    .addTest(new TestBuilder().build())
                                    .addTest(new TestBuilder().build())
                                    .build();

      const firstTest = new TestBuilder().withTestCaseCount(1).build();
      const secondTest = new TestBuilder().withTestCaseCount(1).build();

      const secondTestFixture = new TestFixtureBuilder()
                                    .addTest(firstTest)
                                    .addTest(secondTest)
                                    .build();

      secondTestFixture.focussed = true;

      const testSet = new TestSetBuilder()
                           .addTestFixture(firstTestFixture)
                           .addTestFixture(secondTestFixture)
                           .build();

      const testPlan = new TestPlan(testSet);

      Expect(testPlan.testItems.length).toBe(2);
      Expect(testPlan.testItems[0].test).toBe(firstTest);
      Expect(testPlan.testItems[0].testCase).toBe(firstTest.testCases[0]);
      Expect(testPlan.testItems[1].test).toBe(secondTest);
      Expect(testPlan.testItems[1].testCase).toBe(secondTest.testCases[0]);
   }

   @Test()
   public onlyFirstFocussedTestInSecondTestFixtureAddedToTestItems() {

      const firstTestFixture = new TestFixtureBuilder()
                                    .addTest(new TestBuilder().build())
                                    .addTest(new TestBuilder().build())
                                    .build();

      const firstTest = new TestBuilder().withTestCaseCount(1).build();
      const secondTest = new TestBuilder().withTestCaseCount(1).build();

      const secondTestFixture = new TestFixtureBuilder()
                                    .addTest(firstTest)
                                    .addTest(secondTest)
                                    .build();

      secondTestFixture.focussed = true;
      firstTest.focussed = true;

      const testSet = new TestSetBuilder()
                           .addTestFixture(firstTestFixture)
                           .addTestFixture(secondTestFixture)
                           .build();

      const testPlan = new TestPlan(testSet);

      Expect(testPlan.testItems.length).toBe(1);
      Expect(testPlan.testItems[0].test).toBe(firstTest);
      Expect(testPlan.testItems[0].testCase).toBe(firstTest.testCases[0]);
   }

   @Test()
   public onlySecondFocussedTestInSecondTestFixtureAddedToTestItems() {

      const firstTestFixture = new TestFixtureBuilder()
                                    .addTest(new TestBuilder().build())
                                    .addTest(new TestBuilder().build())
                                    .build();

      const firstTest = new TestBuilder().withTestCaseCount(1).build();
      const secondTest = new TestBuilder().withTestCaseCount(1).build();

      const secondTestFixture = new TestFixtureBuilder()
                                    .addTest(firstTest)
                                    .addTest(secondTest)
                                    .build();

      secondTestFixture.focussed = true;
      secondTest.focussed = true;

      const testSet = new TestSetBuilder()
                           .addTestFixture(firstTestFixture)
                           .addTestFixture(secondTestFixture)
                           .build();

      const testPlan = new TestPlan(testSet);

      Expect(testPlan.testItems.length).toBe(1);
      Expect(testPlan.testItems[0].test).toBe(secondTest);
      Expect(testPlan.testItems[0].testCase).toBe(secondTest.testCases[0]);
   }
}
