import { Expect, TestCase, TestFixture } from "../../../../../core/alsatian-core";

@TestFixture("@TestCase Tests")
export class CaseArgumentTestsTests {
   @TestCase(1, 2, 3)
   @TestCase(1.5, 2.5, 4)
   AddNumbers(first, second, expected) {
      Expect(first + second).toBe(expected);
   }

   @TestCase("Hello", " world!", "Hello world!")
   @TestCase("Far", "away", "Faraway")
   AddStrings(first, second, expected) {
      Expect(first + second).toBe(expected);
   }

   @TestCase({a: 1}, {a: 2}, 3)
   AddObjectProperty(first, second, expected) {
      Expect(first.a + second.a).toBe(expected);
   }

   @TestCase([1, 2], [3, 4], 10)
   AddArray(first, second, expected) {
      const reduced = [...first, ...second].reduce((agg, curr) => agg + curr, 0);
      Expect(reduced).toBe(expected);
   }
}
