import "reflect-metadata";
import { Expect, METADATA_KEYS, Test, TestCase } from "../../../core/alsatian-core";
import { Timeout as TimeoutDecorator } from "../../../core/decorators/timeout-decorator";

export class TimeoutDecoratorTests {

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public testTimeoutMetaDataAdded(timeout: number) {
      const timeoutDecorator = TimeoutDecorator(timeout);

      const testFixture = {};

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
