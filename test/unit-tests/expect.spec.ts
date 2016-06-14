import { Expect, Test, TestCase } from "../../core/alsatian-core";

export class ExpectTests {

   @Test()
   public nullShouldNotThrowError() {
      let expect = Expect(null);

      Expect(() => { expect.toBeNull() }).not.toThrow();
   }

   @TestCase(undefined)
   @TestCase(0)
   @TestCase(42)
   @TestCase(-42)
   @TestCase("")
   @TestCase("something")
   @TestCase({})
   @TestCase({ with: "something" })
   @TestCase([])
   @TestCase([ 1 ])
   @TestCase([ 1, 2 ])
   public nullShouldThrowErrorForNonNullValues(value: any) {
      let expect = Expect(value);

      Expect(() => { expect.toBeNull() }).toThrow();
   }
}
