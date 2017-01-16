import { Expect, SpyOn, Test, TestCase } from "../../../core/alsatian-core";
import { TestSetResults } from "../../../core/results";
import { TestItem, TestPlan, TestSetRunInfo } from "../../../core/running";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestSetBuilder } from "../../builders/test-set-builder";

export class TestSetRunInfoTests {

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(new TestPlan(new TestSetBuilder().build()))
   public correctTestPlanSet(testPlan: TestPlan) {
      const testSetRunInfo = new TestSetRunInfo(testPlan, new TestSetResults(), 1);

      Expect(testSetRunInfo.testPlan).toBe(testPlan);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(new TestSetResults())
   public correctTestSetResultsSet(testSetResults: TestSetResults) {
      const testSet = new TestSetBuilder().build();

      const testSetRunInfo = new TestSetRunInfo(new TestPlan(testSet), testSetResults, 1);

      Expect(testSetRunInfo.testSetResults).toBe(testSetResults);
   }

   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   public correctTimeoutSet(timeout: number) {
      const testSet = new TestSetBuilder().build();

      const testSetRunInfo = new TestSetRunInfo(new TestPlan(testSet), new TestSetResults(), timeout);

      Expect(testSetRunInfo.timeout).toBe(timeout);
   }

   @TestCase(null)
   @TestCase(undefined)
   public settingNullOrUndefinedTestPlanItemThrowsError(testPlanItem: TestItem) {
      const testSet = new TestSetBuilder().build();

      const testSetRunInfo = new TestSetRunInfo(new TestPlan(testSet), new TestSetResults(), 1);

      Expect(() => testSetRunInfo.testPlanItem = testPlanItem)
        .toThrowError(TypeError, "testPlanItem must not be null or undefined.");
   }

   @Test()
   public settingTestPlanItemIsStored() {
      const testSet = new TestSetBuilder().build();

      const testSetRunInfo = new TestSetRunInfo(new TestPlan(testSet), new TestSetResults(), 1);

      const testPlanItem = new TestItem(
        new TestFixtureBuilder().build(),
        new TestBuilder().build(),
        new TestCaseBuilder().build()
      );

      testSetRunInfo.testPlanItem = testPlanItem;

      Expect(testSetRunInfo.testPlanItem).toBe(testPlanItem);
   }
 }
