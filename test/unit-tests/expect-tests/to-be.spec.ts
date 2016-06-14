import { ExactMatchError } from "../../../core/errors/exact-match-error";
import { Expect, Test, TestCase } from "../../../core/alsatian-core";

export class ToBeTests {

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(42)
   @TestCase(4.2)
   @TestCase(-4.2)
   @TestCase("")
   @TestCase("something")
   public identicalSimpleTypesDontThrow(value: any) {
      let expect = Expect(value);

      Expect(() => expect.toBe(value)).not.toThrow();
   }

   @TestCase(undefined, undefined)
   @TestCase(null, null)
   @TestCase(0, 0)
   @TestCase(42, 42)
   @TestCase(4.2, 4.2)
   @TestCase(-4.2, -4.2)
   @TestCase("", "")
   @TestCase("something", "something")
   public matchingIdenticalSimpleTypesDontThrow(expected: any, actual: any) {
      let expect = Expect(actual);

      Expect(() => expect.toBe(expected)).not.toThrow();
   }

   @TestCase({})
   @TestCase({ "with": "something" })
   @TestCase({ "with": { "something": "more" }, "complex": "!", foSho: true, answer: 42})
   @TestCase([])
   @TestCase([ 1, 2, 3 ])
   @TestCase([ { "with": "something" }, { "and": "something", "else": "!"} ])
   public identicalComplexTypesDontThrow(value: any) {
      let expect = Expect(value);

      Expect(() => expect.toBe(value)).not.toThrow();
   }

}
