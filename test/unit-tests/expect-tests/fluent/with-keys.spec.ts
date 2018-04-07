import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any,
  MatchError,
  SpyOn,
  Expect as OriginalExpect
} from "../../../../core/alsatian-core";

export class WithKeysTests {
  @TestCase(undefined)
  @TestCase(null)
  public propertylessTypesThrow(value: any) {
    const expect = Expect(value);

    Expect(() => expect.with.keys(["something"]))
      .to.throw(MatchError)
      .with.properties({ message: /should be defined/ });
  }

  @TestCase({ something: 123 })
  @TestCase({ 123: 456, something: false })
  public hasKeysNoThrow(value: any) {
    const expect = Expect(value);

    Expect(() => expect.with.keys(["something"])).not.to.throw();
  }

  @TestCase({ something: 123 })
  @TestCase({ 123: 456, something: false })
  public missingKeysThrows(value: any) {
    const expect = Expect(value);

    Expect(() => expect.with.keys(["somethingElse"]))
      .to.throw(MatchError)
      .with.properties({ message: /does not contain all/ });
  }
}
