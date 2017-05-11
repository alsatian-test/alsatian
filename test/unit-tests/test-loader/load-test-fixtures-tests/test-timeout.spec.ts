import "reflect-metadata";
import { Expect, METADATA_KEYS, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

export class TestTimeoutTests {

   @Test()
   public noTimeoutSetToNullTest() {

     const fileRequirer = new FileRequirer();

     const testFixtureInstance = {
       noTimeoutTest: () => {}
     };
     const noTimeoutTest = {
       key: "noTimeoutTest"
     };
     Reflect.defineMetadata(METADATA_KEYS.TESTS, [ noTimeoutTest ], testFixtureInstance);

     const testFixtureConstructor = () => testFixtureInstance;

     const spy = SpyOn(fileRequirer, "require");
     spy.andStub();
     spy.andReturn(testFixtureConstructor);

     const testLoader = new TestLoader(fileRequirer);

     Expect(testLoader.loadTestFixture("test")[0].tests[0].timeout).toBe(null);
   }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    public timeoutSetTest(timeoutPeriod: number) {

      const fileRequirer = new FileRequirer();

      const testFixtureInstance = {
        timeoutTest: () => {}
      };
      const timeoutTest = {
        key: "timeoutTest"
      };
      Reflect.defineMetadata(METADATA_KEYS.TESTS, [ timeoutTest ], testFixtureInstance);
      Reflect.defineMetadata(METADATA_KEYS.TIMEOUT, timeoutPeriod, testFixtureInstance, "timeoutTest");

      const testFixtureConstructor = () => testFixtureInstance;

      const spy = SpyOn(fileRequirer, "require");
      spy.andStub();
      spy.andReturn(testFixtureConstructor);

      const testLoader = new TestLoader(fileRequirer);

      Expect(testLoader.loadTestFixture("test")[0].tests[0].timeout).toBe(timeoutPeriod);
    }
 }
