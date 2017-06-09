import { GlobHelper, TestLoader } from "../../../core/";
import { Expect, SpyOn, Test, TestCase } from "../../../core/alsatian-core";
import { TestSet } from "../../../core/test-set";

export class LoadTestTests {

   @Test()
   public noTestsAtLocationGivesNoTestFixtures() {
      const testLoader = new TestLoader(null);
      const testLoaderSpy = SpyOn(testLoader, "loadTestFixture");
      testLoaderSpy.andReturn([]);
      testLoaderSpy.andStub();

      const globHelper = new GlobHelper();
      SpyOn(globHelper, "isGlob").andReturn(false);

      const testSet = new TestSet(testLoader, globHelper);

      testSet.addTestsFromFiles("no-tests");

      Expect(testSet.testFixtures.length).toBe(0);
   }
}
