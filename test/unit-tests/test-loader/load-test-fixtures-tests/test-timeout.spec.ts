import { TestLoader } from "../../../../core/test-loader";
import { FileRequirer } from "../../../../core/file-requirer";
import { Expect, Test, TestCase, SpyOn } from "../../../../core/alsatian-core";
import "reflect-metadata";

export class TestTimeoutTests {

   @Test()
   public noTimeoutSetToNullTest() {

     let fileRequirer = new FileRequirer();

     let testFixtureInstance = {
       "noTimeoutTest": () => {}
     };
     let noTimeoutTest = {
       key: "noTimeoutTest"
     };
     Reflect.defineMetadata("alsatian:tests", [ noTimeoutTest ], testFixtureInstance);

     let testFixtureConstructor = () => testFixtureInstance;

     let spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureConstructor);

     let testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].tests[0].timeout).toBe(null);
   }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    public timeoutSetTest(timeoutPeriod: number) {

      let fileRequirer = new FileRequirer();

      let testFixtureInstance = {
        "timeoutTest": () => {}
      };
      let timeoutTest = {
        key: "timeoutTest"
      };
      Reflect.defineMetadata("alsatian:tests", [ timeoutTest ], testFixtureInstance);
      Reflect.defineMetadata("alsatian:timeout", timeoutPeriod, testFixtureInstance, "timeoutTest");

      let testFixtureConstructor = () => testFixtureInstance;

      let spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureConstructor);

      let testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test")[0].tests[0].timeout).toBe(timeoutPeriod);
    }
 }
