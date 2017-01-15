import { Expect, Test } from "../../../core/alsatian-core";
import { FunctionSpyCallCountMatcher } from "../../../core/matchers/function-spy-call-count-matcher";

export class FunctionSpyCallCountMatcherTests {

   @Test()
   public timesNotToBeDefined() {
      Expect(new FunctionSpyCallCountMatcher().times).not.toBeDefined();
   }
}
