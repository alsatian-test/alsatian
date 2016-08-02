import "reflect-metadata";
import { Timeout as TimeoutDecorator } from "../../../core/decorators/timeout-decorator";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class TimeoutDecoratorTests {

   @Test()
   public testAddedAsMetaData() {
      let timeoutDecorator = TimeoutDecorator(0);

      let testFixture = {};

      timeoutDecorator(testFixture, "test", null);

      let tests = Reflect.getMetadata("alsatian:tests", testFixture);

      Expect(tests).toBeDefined();
      Expect(tests).not.toBeNull();
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public testTimeoutMetaDataAdded(timeout: number) {
      let timeoutDecorator = TimeoutDecorator(timeout);

      let testFixture = {};

      timeoutDecorator(testFixture, "test", null);

      let tests = Reflect.getMetadata("alsatian:tests", testFixture);

      Expect(tests[0].timeout).toBe(timeout);
   }

   @TestCase(0)
   @TestCase(-1)
   @TestCase(-42)
   public incorrectTestTimeoutThrowsError(timeout: number) {
      Expect(() => TimeoutDecorator(timeout)).toThrowError(RangeError, "Timeout period must be greater than 0.");
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public correctTestCountAdded(testCount: number) {
      let timeoutDecorator = TimeoutDecorator(0);

      let testFixture = {};

      for (let i = 0; i < testCount; i ++) {
         timeoutDecorator(testFixture, "key " + i, null);
      }

      let tests = Reflect.getMetadata("alsatian:tests", testFixture);

      Expect(tests.length).toBe(testCount);
   }

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public noDuplicateTestKeysAdded(testCount: number) {
      let timeoutDecorator = TimeoutDecorator(0);

      let testFixture = {};

      for (let i = 0; i < testCount; i ++) {
         timeoutDecorator(testFixture, "key", null);
      }

      let tests = Reflect.getMetadata("alsatian:tests", testFixture);

      Expect(tests.length).toBe(1);
   }
}
