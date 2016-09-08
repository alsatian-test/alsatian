import { Expect, TestCase, TestTimeoutError } from "../../../core/alsatian-core";

export class TestTimeoutErrorTests {

   @TestCase(1)
   @TestCase(2)
   @TestCase(42)
   public shouldStoreMessage(timeout: number) {
      let error = new TestTimeoutError(timeout);

      Expect(error.message).toBe(`The test exceeded the given timeout of ${timeout}ms.`);
   }
}
