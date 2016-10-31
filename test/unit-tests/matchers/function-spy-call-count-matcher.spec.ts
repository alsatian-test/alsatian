import { Expect, Test, FocusTests } from "../../../core/alsatian-core";
import { FunctionSpyCallCountMatcher } from "../../../core/matchers/function-spy-call-count-matcher";

@FocusTests
export class FunctionSpyCallCountMatcherTests {

   @Test()
   public timesNotToBeDefined() {
      Expect(new FunctionSpyCallCountMatcher().times).not.toBeDefined();
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

   //invalid enum value
}
