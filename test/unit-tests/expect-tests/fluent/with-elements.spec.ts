import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any,
  MatchError,
  SpyOn,
  Expect as OriginalExpect
} from "../../../../core/alsatian-core";

export class WithElementsTests {
  @TestCase(undefined)
  @TestCase(null)
  public nonArrayTypesThrow(value: any) {
    const expect = Expect(value);

    Expect(() => expect.with.elements(["something"]))
      .to.throw(MatchError)
      .with.properties({ message: /not an array type/ });
  }

  @TestCase(["something"])
  @TestCase(["123", 456, "something"])
  public hasElementsNoThrow(value: any) {
    const expect = Expect(value);

    Expect(() => expect.with.elements(["something"])).not.to.throw();
  }

  @TestCase(["something"])
  @TestCase(["123", 456, "something"])
  public missingElementsThrows(value: any) {
    const expect = Expect(value);

    Expect(() => expect.with.elements(["somethingElse"]))
      .to.throw(MatchError)
      .with.properties({ message: /does not contain all/ });
  }
}
