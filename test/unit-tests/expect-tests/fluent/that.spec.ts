import {
  FluentExpect as Expect,
  Test,
  TestCase,
  FocusTests,
  Any
} from "../../../../core/alsatian-core";

export class ThatTests {
  @Test()
  public FluentEntityMatcher_dotThat_ReturnsNewWithRightValues() {
    const expect = Expect({ one: 2 }).to.have(p => p.one);
    const that = expect.that;
    that.equals(2); // finish
  }

  @Test()
  public FluentEntityMatcher_dotThat_NegationTightlyBound() {
    const expect = Expect({ hi: "there" }).not.to.have((p: any) => p.something);
    const notthat = expect.not.that;
    notthat.isDefined();
  }
}
