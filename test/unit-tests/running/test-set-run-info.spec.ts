import { TestSetRunInfo, TestPlan, TestItem } from "../../../core/_running";
import { TestSetResults } from "../../../core/_results";
import { Expect, Test, TestCase, IgnoreTest, SpyOn } from "../../../core/alsatian-core";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";
import { TestBuilder } from "../../builders/test-builder";
import { TestCaseBuilder } from "../../builders/test-case-builder";
import { TestSet } from "../../../core/test-set";
import * as rewire from "rewire";

export class TestSetRunInfoTests {

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(new TestPlan(new TestSet(null, null)))
   public correctTestPlanSet(testPlan: TestPlan) {
      const testSetRunInfo = new TestSetRunInfo(testPlan, new TestSetResults(), 1);

      Expect(testSetRunInfo.testPlan).toBe(testPlan);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(new TestSetResults())
   public correctTestSetResultsSet(testSetResults: TestSetResults) {
      const testSetRunInfo = new TestSetRunInfo(new TestPlan(new TestSet(null, null)), testSetResults, 1);

      Expect(testSetRunInfo.testSetResults).toBe(testSetResults);
   }

   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   public correctTimeoutSet(timeout: number) {
      const testSetRunInfo = new TestSetRunInfo(new TestPlan(new TestSet(null, null)), new TestSetResults(), timeout);

      Expect(testSetRunInfo.timeout).toBe(timeout);
   }

   @TestCase(null)
   @TestCase(undefined)
   public settingNullOrUndefinedTestPlanItemThrowsError(testPlanItem: TestItem) {
      const testSetRunInfo = new TestSetRunInfo(new TestPlan(new TestSet(null, null)), new TestSetResults(), 1);

      Expect(() => testSetRunInfo.testPlanItem = testPlanItem).toThrowError(TypeError, "testPlanItem must not be null or undefined.");
   }

   @Test()
   public settingTestPlanItemIsStored() {
      const testSetRunInfo = new TestSetRunInfo(new TestPlan(new TestSet(null, null)), new TestSetResults(), 1);

      const testPlanItem = new TestItem(new TestFixtureBuilder().build(), new TestBuilder().build(), new TestCaseBuilder().build());

      testSetRunInfo.testPlanItem = testPlanItem;

      Expect(testSetRunInfo.testPlanItem).toBe(testPlanItem);
   }
 }
