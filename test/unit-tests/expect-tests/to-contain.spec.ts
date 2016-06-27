import { ContentsMatchError } from "../../../core/errors/contents-match-error";
import { Expect, TestCase } from "../../../core/alsatian-core";

export class ToContainTests {

   @TestCase([], 1)
   @TestCase([ 1, 2 ], 42)
   @TestCase("", "something")
   @TestCase("something", "another thing")
   public shouldContainAndDoesNotThrows(actualValue: any, expectedContent: any) {
      let expect = Expect(actualValue);

      Expect(() => expect.toContain(expectedContent)).toThrowError(ContentsMatchError, "Expected " + JSON.stringify(actualValue) + " to contain " + JSON.stringify(expectedContent) + ".");
   }

   @TestCase([ 1 ], 1)
   @TestCase([ 1, 42 ], 42)
   @TestCase("something", "something")
   @TestCase("something", "thing")
   public shouldContainAndDoesDoesNotThrow(actualValue: any, expectedContent: any) {
      let expect = Expect(actualValue);

      Expect(() => expect.toContain(expectedContent)).not.toThrow();
   }

   @TestCase([], 1)
   @TestCase([ 1, 2 ], 42)
   @TestCase("", "something")
   @TestCase("something", "another thing")
   public shouldNotContainAndDoesNotDoesNotThrow(actualValue: any, expectedContent: any) {
      let expect = Expect(actualValue);

      Expect(() => expect.not.toContain(expectedContent)).not.toThrow();
   }

   @TestCase([ 1 ], 1)
   @TestCase([ 1, 42 ], 42)
   @TestCase("something", "something")
   @TestCase("something", "thing")
   public shouldNotContainAndDoesThrows(actualValue: any, expectedContent: any) {
      let expect = Expect(actualValue);

      Expect(() => expect.not.toContain(expectedContent)).toThrowError(ContentsMatchError, "Expected " + JSON.stringify(actualValue) + " not to contain " + JSON.stringify(expectedContent) + ".");
   }
 }
