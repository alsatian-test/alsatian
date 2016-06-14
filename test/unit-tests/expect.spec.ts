import { Expect, Test, TestCase } from "../../core/alsatian-core";

export class ExpectTests {

   @Test()
   public nullShouldNotThrowError() {
      let expect = Expect(null);

      Expect(() => { expect.toBeNull() }).not.toThrow();
   }
}
