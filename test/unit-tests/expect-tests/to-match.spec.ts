import { Expect, TestCase } from "../../../core/alsatian-core";
import { RegexMatchError } from "../../../core/errors/regex-match-error";

export class ToMatchTests {

   @TestCase("thing", /something/)
   @TestCase("another thing", /this and that/)
   public shouldMatchAndDoesNotThrows(actualValue: any, expectedRegex: RegExp) {
      const expect = Expect(actualValue);

      Expect(() => expect.toMatch(expectedRegex))
   .toThrowError(RegexMatchError, `Expected ${JSON.stringify(actualValue)} to conform to ${expectedRegex}.`);
   }

   @TestCase("something", /thing/)
   @TestCase("another thing", /another thing/)
   public shouldMatchAndDoesDoesNotThrow(actualValue: any, expectedRegex: RegExp) {
      const expect = Expect(actualValue);

      Expect(() => expect.toMatch(expectedRegex)).not.toThrow();
   }

   @TestCase("thing", /something/)
   @TestCase("another thing", /this and that/)
   public shouldNotMatchAndDoesNotDoesNotThrow(actualValue: any, expectedRegex: RegExp) {
      const expect = Expect(actualValue);

      Expect(() => expect.not.toMatch(expectedRegex)).not.toThrow();
   }

   @TestCase("something", /thing/)
   @TestCase("another thing", /another thing/)
   public shouldNotMatchAndDoesThrows(actualValue: any, expectedRegex: RegExp) {
      const expect = Expect(actualValue);

      Expect(() => expect.not.toMatch(expectedRegex))
        .toThrowError(RegexMatchError, `Expected ${JSON.stringify(actualValue)} not to conform to ${expectedRegex}.`);
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
   public checkingWhetherNonStringMatchesRegexShouldThrow(actualValue: any) {
      Expect(() => Expect(actualValue).toMatch(/test/))
        .toThrowError(TypeError, "toMatch must only be used to match on strings.");
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
   public checkingWhetherNonStringDoesNotMatchRegexShouldThrow(actualValue: any) {
      Expect(() => Expect(actualValue).not.toMatch(/test/))
        .toThrowError(TypeError, "toMatch must only be used to match on strings.");
   }

   @TestCase(undefined)
   @TestCase(null)
   public checkingStringMatchesNullOrUndefinedRegularExpressionShouldThrow(regex: RegExp) {
      Expect(() => Expect("something").toMatch(regex))
        .toThrowError(TypeError, "toMatch regular expression must not be null or undefined.");
   }

   @TestCase(undefined)
   @TestCase(null)
   public checkingStringDoesNotMatchNullOrUndefinedRegularExpressionShouldThrow(regex: RegExp) {
      Expect(() => Expect("something").not.toMatch(regex))
        .toThrowError(TypeError, "toMatch regular expression must not be null or undefined.");
   }
 }
