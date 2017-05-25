import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { ExactMatchError } from "../../../core/errors/exact-match-error";

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
      const expect = Expect(value);

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
   public matchingSimpleTypesDontThrow(expected: any, actual: any) {
      const expect = Expect(actual);

      Expect(() => expect.toBe(expected)).not.toThrow();
   }

   @Test()
   public differentValuesThrowsExactMatchError() {
      const expect = Expect(1);

      Expect(() => expect.toBe(2)).toThrowError(ExactMatchError, "Expected 1 to be 2.");
   }

   @TestCase("something", "something else")
   @TestCase("", "something")
   @TestCase(0, 42)
   @TestCase(42, 0)
   public differentSimpleValuesToThrow(expected: any, actual: any) {
      const expect = Expect(actual);

      Expect(() => expect.toBe(expected)).toThrow();
   }

   @TestCase("something", "something else")
   @TestCase("", "something")
   @TestCase(0, 42)
   @TestCase(42, 0)
   public differentSimpleValuesThrowsExactMatchErrorWithCorrectMessage(expected: any, actual: any) {
      const expect = Expect(actual);

      Expect(() => expect.toBe(expected))
        .toThrowError(ExactMatchError, `Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}.`);
   }

   @TestCase(undefined, null)
   @TestCase(null, undefined)
   @TestCase(42, "something")
   @TestCase("something", 42)
   public differentSimpleTypesToThrow(expected: any, actual: any) {
      const expect = Expect(actual);

      Expect(() => expect.toBe(expected)).toThrow();
   }

   @TestCase({})
   @TestCase({ with: "something" })
   @TestCase({ with: { something: "more" }, complex: "!", foSho: true, answer: 42})
   @TestCase([])
   @TestCase([ 1, 2, 3 ])
   @TestCase([ { with: "something" }, { and: "something", else: "!"} ])
   public identicalComplexTypesDontThrow(value: any) {
      const expect = Expect(value);

      Expect(() => expect.toBe(value)).not.toThrow();
   }

   @TestCase({}, {})
   @TestCase({ with: "something" }, { with: "something" })
   @TestCase({ with: { something: "more" }, complex: "!", foSho: true, answer: 42},
             { with: { something: "more" }, complex: "!", foSho: true, answer: 42})
   @TestCase([], [])
   @TestCase([ 1, 2, 3 ], [ 1, 2, 3 ])
   @TestCase([ { with: "something" }, { and: "something", else: "!"} ],
             [ { with: "something" }, { and: "something", else: "!"} ])
   public matchingComplexTypesThrow(expected: any, actual: any) {
      const expect = Expect(actual);

      Expect(() => expect.toBe(expected)).toThrow();
   }

   @TestCase({}, { with: "something" })
   @TestCase({ with: "something" }, { })
   @TestCase([], [ 1, 2, 3 ])
   @TestCase([ 1, 2, 3 ], [])
   public differentComplexValuesThrowsExactMatchErrorWithCorrectMessage(expected: any, actual: any) {
      const expect = Expect(actual);

      Expect(() => expect.toBe(expected))
        .toThrowError(
            ExactMatchError,
            `Expected ${JSON.stringify(actual).replace(/,/g, ", ")} ` +
            `to be ${JSON.stringify(expected).replace(/,/g, ", ")}.`);
   }

   @TestCase({}, [])
   @TestCase([], {})
   @TestCase({ with: "something" }, [ 1, 2, 3 ])
   @TestCase([ 1, 2, 3 ], { with: "something" })
   @TestCase([ ], { with: "something" })
   @TestCase([ 1, 2, 3 ], { })
   public differentComplexTypesToThrow(expected: any, actual: any) {
      const expect = Expect(actual);

      Expect(() => expect.toBe(expected)).toThrow();
   }

}
