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
}
