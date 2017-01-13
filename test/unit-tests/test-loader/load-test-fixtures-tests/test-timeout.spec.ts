import "reflect-metadata";
import { Expect, METADATA_KEYS, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

export class TestTimeoutTests {

   @Test()
   public noTimeoutSetToNullTest() {

     let fileRequirer = new FileRequirer();

     let testFixtureInstance = {
       noTimeoutTest: () => {}
     };
     let noTimeoutTest = {
       key: "noTimeoutTest"
     };
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [ noTimeoutTest ], testFixtureInstance);

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
        timeoutTest: () => {}
      };
      let timeoutTest = {
        key: "timeoutTest"
      };
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [ timeoutTest ], testFixtureInstance);
      Reflect.defineMetadata(METADATA_KEYS.TIMEOUT, timeoutPeriod, testFixtureInstance, "timeoutTest");

      let testFixtureConstructor = () => testFixtureInstance;

      let spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureConstructor);

      let testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test")[0].tests[0].timeout).toBe(timeoutPeriod);
    }
 }
