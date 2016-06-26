import { TestSet } from "../../../core/test-set";
import { Expect, Test, TestCase, IgnoreTest } from "../../../core/alsatian-core";
import * as rewire from "rewire";

export class LoadTestTests {

   @Test()
   @IgnoreTest
   public noTestsAtLocationGivesNoTestFixtures() {
     require = (<any>{});
     let testSet = new TestSet("");

     Expect(testSet.testFixtures.length).toBe(0);
   }
 }
