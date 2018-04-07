import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../../core/alsatian-core";

export class AndTests {
  @Test()
  public FluentEntityMatcher_dotAnd_ReturnsNewNextWithRightValues() {
    const expect = Expect(123).not.to.equal(54);
    const and = expect.and;
    and.to.equal(123); // finish
  }

  @Test()
  public FluentPropertiesMatcher_dotAnd_ReturnsNewNextWithRightValues() {
    const expect = Expect({ hi: "there" }).not.with.properties({ hi: "you" });
    const and = expect.and;
    and.with.keys(["hi"]);
  }
}
