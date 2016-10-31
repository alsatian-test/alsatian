import { Expect, TestCase, FocusTests } from "../../../core/alsatian-core";
import { FunctionSpyMatcher } from "../../../core/matchers/function-spy-matcher";
import { FunctionSpy } from "../../../core/_spying";

@FocusTests
export class FunctionSpyMatcherTests {

   @TestCase(null)
   @TestCase(undefined)
   public nullOrUndefinedSpyThrowsError(spy: FunctionSpy) {
      Expect(() => new FunctionSpyMatcher(spy, true)).toThrowError(TypeError, "spy must not be null or undefined.");
   }

   @TestCase(null)
   @TestCase(undefined)
   public nullOrUndefinedSpyThrowsErrorIfShouldNotMatch(spy: FunctionSpy) {
      Expect(() => new FunctionSpyMatcher(spy, false)).toThrowError(TypeError, "spy must not be null or undefined.");
   }

   //Less than matches
   //Not Less than matches

   //Less than does not match
   //Not Less than does not match

   //More than matches
   //Not more than matches

   //More than does not match
   //Not more than does not match

   //exactly matches
   //not exactly matches

   //exactly does not match
   //not exactly does not match
}
