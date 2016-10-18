import { TestSet } from "../../core/test-set";
import { ITestFixture } from "../../core/_interfaces/test-fixture.i";
import { SpyOnProperty } from "../../core/alsatian-core";

export class TestSetBuilder {

   private _testSet: TestSet = <any>{};

   private _testFixtures: Array<ITestFixture> = [];

   public constructor() {
      Object.defineProperty(this._testSet, "testFixtures", { get: () => null, configurable: true });
      SpyOnProperty(this._testSet, "testFixtures").andReturnValue(this._testFixtures);
   }

   public withTestFixtures(testFixtures: Array<ITestFixture>): TestSetBuilder {
      this._testFixtures = testFixtures;
      SpyOnProperty(this._testSet, "testFixtures").andReturnValue(this._testFixtures);
      return this;
   }

   public addTestFixture(testFixture: ITestFixture): TestSetBuilder {
      this._testFixtures.push(testFixture);
      return this;
   }

   public build (): TestSet {
      return this._testSet;
   }
}
