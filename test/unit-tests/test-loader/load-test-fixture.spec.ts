import { TestLoader } from "../../../core/test-loader";
import { FileRequirer } from "../../../core/file-requirer";
import { Expect, Test, TestCase, SpyOn, FocusTests } from "../../../core/alsatian-core";
import "reflect-metadata";

export class LoadTestTests {

   @Test()
   public ignoredShouldBeFalseByDefault() {

     let fileRequirer = new FileRequirer();

     let testFixtureSet = {
        testFixture: () => {}
     };

     let spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     let testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test").ignored).toBe(false);
   }

   @Test()
   public ignoredShouldBeTrueIfMetadataSet() {

     let fileRequirer = new FileRequirer();

     let testFixtureSet = {
        testFixture: () => {}
     };

     Reflect.defineMetadata("alsatian:ignore", true,  testFixtureSet.testFixture);

     let spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureSet);

     let testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test").ignored).toBe(true);
   }
 }
