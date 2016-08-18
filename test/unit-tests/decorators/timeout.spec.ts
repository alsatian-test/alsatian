import "reflect-metadata";
import { Timeout as TimeoutDecorator } from "../../../core/decorators/timeout-decorator";
import { Expect, Test, TestCase, METADATA_KEYS } from "../../../core/alsatian-core";

export class TimeoutDecoratorTests {

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public testTimeoutMetaDataAdded(timeout: number) {
      let timeoutDecorator = TimeoutDecorator(timeout);

      let testFixture = {};

      timeoutDecorator(testFixture, "test", null);

      Expect(Reflect.getMetadata(METADATA_KEYS.TIMEOUT, testFixture, "test")).toBe(timeout);
   }

   @TestCase(0)
   @TestCase(-1)
   @TestCase(-42)
   public incorrectTestTimeoutThrowsError(timeout: number) {
      Expect(() => TimeoutDecorator(timeout)).toThrowError(RangeError, "Timeout period must be greater than 0.");
   }
}
