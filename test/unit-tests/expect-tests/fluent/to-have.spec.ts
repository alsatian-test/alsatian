import {
  FluentExpect as Expect,
  Test,
  TestCase,
  FocusTests,
  Any,
  MatchError
} from "../../../../core/alsatian-core";

export class ToHaveTests {
  @Test()
  public ToHave_ThrowsWhenNotProvidedFunc() {
    const lambda = () => Expect({ one: 2 }).to.have(3 as any);
    Expect(lambda)
      .to.throw<Error>()
      .that.has(p => p.message)
      .that.matches(/not a function/);
  }

  @Test()
  public ToHave_NoMatchWhenPropertyMissing() {
    const lambda = () =>
      Expect({ hi: "there" }).to.have((p: any) => p.something);
    Expect(lambda)
      .to.throw<MatchError>()
      .that.has(p => p.message)
      .that.matches(/should be defined/);
  }

  @Test()
  public ToHave_MatchesWhenPropertyPresent() {
    const lambda = () => Expect({ hi: "there" }).to.have(p => p.hi);
    Expect(lambda).not.to.throw<MatchError>();
  }
}
