import "reflect-metadata";
import { Expect, METADATA_KEYS, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

export class FocussedTestTests {

   @Test()
   public singleUnfocussedTest() {

     let fileRequirer = new FileRequirer();

     let testFixtureInstance = {
       unfocussedTest: () => {}
     };
     let unfocussedTest = {
       key: "unfocussedTest"
     };
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [ unfocussedTest ], testFixtureInstance);

     let testFixtureConstructor = () => testFixtureInstance;

     let spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureConstructor);

     let testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].tests[0].focussed).toBe(false);
   }

    @Test()
    public singleFocussedTest() {

      let fileRequirer = new FileRequirer();

      let testFixtureInstance = {
        focussedTest: () => {}
      };
      let unfocussedTest = {
        key: "focussedTest"
      };
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [ unfocussedTest ], testFixtureInstance);
      Reflect.defineMetadata(METADATA_KEYS.FOCUS, true, testFixtureInstance, "focussedTest");

      let testFixtureConstructor = () => testFixtureInstance;

      let spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureConstructor);

      let testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test")[0].tests[0].focussed).toBe(true);
    }
 }
