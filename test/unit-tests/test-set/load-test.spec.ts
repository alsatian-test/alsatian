import { TestSet } from "../../../core/test-set";
import { TestLoader, GlobHelper } from "../../../core/_core";
import { Expect, Test, TestCase, SpyOn } from "../../../core/alsatian-core";

export class LoadTestTests {

   @Test()
   public noTestsAtLocationGivesNoTestFixtures() {
      let testLoader = new TestLoader(null);
      let testLoaderSpy = SpyOn(testLoader, "loadTestFixture");
      testLoaderSpy.andReturn([]);
      testLoaderSpy.andStub();

      let globHelper = new GlobHelper();
      SpyOn(globHelper, "isGlob").andReturn(false);

      let testSet = new TestSet(testLoader, globHelper);

      testSet.addTestsFromFiles("no-tests");

      Expect(testSet.testFixtures.length).toBe(0);
   }
}
