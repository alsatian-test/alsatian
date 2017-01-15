import { Expect, TestCase } from "../../../core/alsatian-core";
import { ContentsMatchError } from "../../../core/errors/contents-match-error";

export class ToContainTests {

   @TestCase([], 1)
   @TestCase([ 1, 2 ], 42)
   @TestCase("", "something")
   @TestCase("something", "another thing")
   public shouldContainAndDoesNotThrows(actualValue: any, expectedContent: any) {
      let expect = Expect(actualValue);

      Expect(() => expect.toContain(expectedContent)).toThrowError(ContentsMatchError, "Expected " + JSON.stringify(actualValue).replace(",", ", ") + " to contain " + JSON.stringify(expectedContent) + ".");
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

      Expect(() => expect.not.toContain(expectedContent)).toThrowError(ContentsMatchError, "Expected " + JSON.stringify(actualValue).replace(",", ", ") + " not to contain " + JSON.stringify(expectedContent) + ".");
   }

   @TestCase([], 1)
   @TestCase([ 1, 2 ], 42)
   @TestCase("", "something")
   @TestCase("something", "another thing")
   public shouldBeTruthyActualValueSet(container: any, expectedContent: any) {

      let contentsError: ContentsMatchError;

      try {
         Expect(container).toContain(expectedContent);
      }
      catch (error) {
         contentsError = error;
      }

      Expect(contentsError).toBeDefined();
      Expect(contentsError).not.toBeNull();
      Expect(contentsError.actual).toBe(container);
   }

   @TestCase([ 1 ], 1)
   @TestCase([ 1, 42 ], 42)
   @TestCase("something", "something")
   @TestCase("something", "thing")
   public shouldNotBeTruthyActualValueSet(container: any, expectedContent: any) {

      let contentsError: ContentsMatchError;

      try {
         Expect(container).not.toContain(expectedContent);
      }
      catch (error) {
         contentsError = error;
      }

      Expect(contentsError).toBeDefined();
      Expect(contentsError).not.toBeNull();
      Expect(contentsError.actual).toBe(container);
   }

   @TestCase([], 1)
   @TestCase([ 1, 2 ], 42)
   @TestCase("", "something")
   @TestCase("something", "another thing")
   public shoulContainExpectedValueSetToExpectedContent(container: any, expectedContent: any) {

      let contentsError: ContentsMatchError;

      try {
         Expect(container).toContain(expectedContent);
      }
      catch (error) {
         contentsError = error;
      }

      Expect(contentsError).toBeDefined();
      Expect(contentsError).not.toBeNull();
      Expect(contentsError.expected).toBe(expectedContent);
   }

   @TestCase([ 1 ], 1)
   @TestCase([ 1, 42 ], 42)
   @TestCase("something", "something")
   @TestCase("something", "thing")
   public shouldNotConrtainExpectedValueSetToExpectedContent(container: any, expectedContent: any) {

      let contentsError: ContentsMatchError;

      try {
         Expect(container).not.toContain(expectedContent);
      }
      catch (error) {
         contentsError = error;
      }

      Expect(contentsError).toBeDefined();
      Expect(contentsError).not.toBeNull();
      Expect(contentsError.expected).toBe(expectedContent);
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ an: "object"})
   public checkingNonStringOrArraysContainShouldThrow(container: any) {
      Expect(() => Expect(container).toContain("something")).toThrowError(TypeError, "toContain must only be used to check whether strings or arrays contain given contents.");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ an: "object"})
   public checkingNonStringOrArraysDoNotContainShouldThrow(container: any) {
      Expect(() => Expect(container).not.toContain("something")).toThrowError(TypeError, "toContain must only be used to check whether strings or arrays contain given contents.");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase([])
   @TestCase([ "an", "array"])
   public checkingStringContainsNonStringShouldThrow(expectedContent: any) {
      Expect(() => Expect("something").toContain(expectedContent)).toThrowError(TypeError, "toContain cannot check whether a string contains a non string value.");
   }

   @TestCase(undefined)
   @TestCase(null)
   @TestCase(0)
   @TestCase(1)
   @TestCase(42)
   @TestCase({})
   @TestCase({ an: "object"})
   @TestCase([])
   @TestCase([ "an", "array" ])
   public checkingStringDoesNotContainsNonStringShouldThrow(expectedContent: any) {
      Expect(() => Expect("something").not.toContain(expectedContent)).toThrowError(TypeError, "toContain cannot check whether a string contains a non string value.");
   }
 }
