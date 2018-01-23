import {
  buildExpect,
  Expect,
  IExpect,
  MatchError,
  MixedMatcher,
  NumberMatcher,
  Test
} from "../../../core/alsatian-core";

class MatcherExtension extends MixedMatcher {
  public toBeTheAnswer() {
    if (this.actualValue !== 42) {
      throw new MatchError("come on, 42 is the answer!", 42, this.actualValue);
    }
  }
}

interface IExtendedExpect extends IExpect {
  (test: number): MatcherExtension & NumberMatcher;
}

const EXTENDED_EXPECT = buildExpect<IExtendedExpect>(MatcherExtension);

export class ExtendingExpectTests {
  @Test("extension is a mixed matcher")
  public extensionIsMixedMatcher() {
    Expect(EXTENDED_EXPECT(42) instanceof MixedMatcher).toBe(true);
  }

  @Test("extension has new function")
  public extensionHasNewFunctions() {
    Expect(EXTENDED_EXPECT(42).toBeTheAnswer).toBeDefined();
    Expect(EXTENDED_EXPECT(42).toBeTheAnswer).not.toBeNull();
    Expect(typeof EXTENDED_EXPECT(42).toBeTheAnswer).toBe("function");
  }

  @Test("extension retains existing functions")
  public extensionRetainsExistingFunctions() {
    Expect(EXTENDED_EXPECT(42).toBe).toBeDefined();
    Expect(EXTENDED_EXPECT(42).toBe).not.toBeNull();
    Expect(typeof EXTENDED_EXPECT(42).toBe).toBe("function");

    Expect(EXTENDED_EXPECT(42).not.toEqual).toBeDefined();
    Expect(EXTENDED_EXPECT(42).not.toEqual).not.toBeNull();
    Expect(typeof EXTENDED_EXPECT(42).not.toEqual).toBe("function");
  }
}
