import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../../core/alsatian-core";

class MyError extends Error {}

export class AndTests {
  @Test()
  public FluentEntityMatcherAndReturnsSelf() {
    const expect = Expect(123).not.to.equal(54);
    const and = expect.and;
    and.equal(123);
    Expect(and).to.equal(expect);
  }

  @Test()
  public FluentPropertiesMatcherAndReturnsSelf() {
    const expect = Expect({ hi: "there" }).not.with.properties({ hi: "you" });
    const and = expect.and;
    and.keys(["hi"]);
    Expect(and).to.equal(expect);
  }
}
