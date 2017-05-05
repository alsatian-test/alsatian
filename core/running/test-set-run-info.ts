import { TestResults, TestSetResults } from "../alsatian-core";
import { TestItem } from "./test-item";
import { TestPlan } from "./test-plan";

export class TestSetRunInfo {

   public get timeout() {
      return this._timeout;
   }

   public get reportLocation() {
      return this._reportLocation;
   }

   public get testPlan() {
      return this._testPlan;
   }

   public get testSetResults() {
      return this._testSetResults;
   }

   private _testPlanItem: TestItem;
   public get testPlanItem() {
      return this._testPlanItem;
   }

   public set testPlanItem(testPlanItem: TestItem) {
      if (testPlanItem) {
         this._testPlanItem = testPlanItem;
      }
      else {
         throw new TypeError("testPlanItem must not be null or undefined.");
      }
   }

   public constructor(
      private _testPlan: TestPlan,
      private _testSetResults: TestSetResults,
      private _timeout: number,
      private _reportLocation: boolean) {}
}
