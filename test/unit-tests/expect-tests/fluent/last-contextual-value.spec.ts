import {
  FluentExpect as Expect,
  Test,
  TestCase,
  FocusTests,
  Any
} from "../../../../core/alsatian-core";

export class LastContextualValueTests {
  @Test()
  public LastContextualValue_ReturnsMostRecentActual() {
    const last = Expect({ one: 2 }).to.have(p => p.one).lastContextualValue;
    Expect(last).to.equal(2);
  }

  @Test()
  public LastContextualValue_ReturnsExpectedValueWhenFirst() {
    const last = Expect(3).lastContextualValue;
    Expect(last).to.equal(3);
  }
}
