import { Expect, Test, FocusTests } from "../../../core/alsatian-core";
import { FunctionSpyCallCountMatcher } from "../../../core/matchers/function-spy-call-count-matcher";

@FocusTests
export class FunctionSpyCallCountMatcherTests {

   @Test()
   public timesNotToBeDefined() {
      Expect(new FunctionSpyCallCountMatcher().times).not.toBeDefined();
   }

   //Less than
   //Not Less than

   //More than
   //Not more than

   //exactly
   //not exactly

   //invalid enum value
}
