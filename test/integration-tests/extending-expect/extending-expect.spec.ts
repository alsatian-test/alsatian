import { Expect, MatchError, Test, Matcher } from "../../../core/alsatian-core";

class Answer {
  public constructor(public readonly value: number) {}
}

class AnswerMatcher extends Matcher<Answer> {
  public toBeTheAnswer() {
    if (this.actualValue.value !== 42) {
      throw new MatchError("come on, 42 is the answer!", 42, this.actualValue);
    }
  }
}

const EXTENDED_EXPECT = Expect.extend(Answer, AnswerMatcher);

export class ExtendingExpectTests {
  @Test("extension has new function")
  public extensionHasNewFunctions() {
    Expect(EXTENDED_EXPECT(new Answer(42)).toBeTheAnswer).toBeDefined();
    Expect(EXTENDED_EXPECT(new Answer(42)).toBeTheAnswer).not.toBeNull();
    Expect(typeof EXTENDED_EXPECT(new Answer(42)).toBeTheAnswer).toBe(
      "function"
    );
  }

  @Test("extension retains existing functions")
  public extensionRetainsExistingFunctions() {
    Expect(EXTENDED_EXPECT(new Answer(42)).toBe).toBeDefined();
    Expect(EXTENDED_EXPECT(new Answer(42)).toBe).not.toBeNull();
    Expect(typeof EXTENDED_EXPECT(new Answer(42)).toBe).toBe("function");

    Expect(EXTENDED_EXPECT(new Answer(42)).not.toEqual).toBeDefined();
    Expect(EXTENDED_EXPECT(new Answer(42)).not.toEqual).not.toBeNull();
    Expect(typeof EXTENDED_EXPECT(new Answer(42)).not.toEqual).toBe("function");
  }
}
