import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any,
  MatchError,
  SpyOn,
  Expect as OriginalExpect
} from "../../../../core/alsatian-core";

export class WithPropertiesTests {
  @TestCase(undefined)
  @TestCase(null)
  public propertylessTypesThrow(value: any) {
    const expect = Expect(value);

    Expect(() => expect.with.properties({ one: 2 }))
      .to.throw(MatchError)
      .with.properties({ message: /should be defined/ });
  }

  @TestCase({ honey: "sugar" })
  @TestCase({ 123: 653, depth: { deeper: 321 } })
  public propertiesMatchSelves(value: any) {
    const expect = Expect(value);

    Expect(() => expect.with.properties(value)).not.to.throw();
  }

  @TestCase(
    { honey: "sugar" },
    { honey: /ginger/ },
    /regular expression should match/
  )
  @TestCase(
    { 123: 653, depth: { deeper: 321 } },
    { 123: 653, depth: { deeper: "wrong" } },
    /should have matching value/
  )
  public propertiesDontMatchThrows(
    value: any,
    expected: any,
    expectedMessage: RegExp
  ) {
    const expect = Expect(value);

    Expect(() => expect.with.properties(expected))
      .to.throw(MatchError)
      .with.properties({ message: expectedMessage });
  }

  @TestCase(
    { honey: "sugar" },
    { honey: (a: string) => Expect(a).to.equal("sugar") }
  )
  @TestCase({ honey: "sugar" }, { honey: (a: string) => a === "sugar" })
  public propertyLambdasMatchNoThrows(value: any, expected: any) {
    const expect = Expect(value);

    Expect(() => expect.with.properties(expected)).not.to.throw();
  }

  @TestCase(
    { honey: "sugar" },
    { honey: (a: string) => Expect(a).to.equal("cane") }
  )
  @TestCase({ honey: "sugar" }, { honey: (a: string) => a === "cane" })
  public propertyLambdasDontMatchThrows(value: any, expected: any) {
    const expect = Expect(value);

    Expect(() => expect.with.properties(expected)).to.throw();
  }

  @Test()
  public allPropertiesWrapsProperties() {
    const thing = {};
    const expect = Expect({}).with;
    SpyOn(expect, "properties");
    expect.allProperties(thing);
    OriginalExpect(expect.properties).toHaveBeenCalledWith(thing);
  }

  @Test()
  public failsWhenRegexpsDontMatch() {
    const expect = Expect({ one: /123/ });
    Expect(() => expect.with.properties({ one: /321/ }))
      .to.throw(MatchError)
      .with.properties({ message: /regular expressions should match/ });
  }

  @Test()
  public succeedsWhenRegexpsMatch() {
    const expect = Expect({ one: /123/ });
    Expect(() => expect.with.properties({ one: /123/ })).not.to.throw(
      MatchError
    );
  }

  @Test()
  public failsWhenRegexpTargetNotString() {
    const expect = Expect({ one: { complex: "type" } });
    Expect(() => expect.with.properties({ one: /123/ }))
      .to.throw(MatchError)
      .with.properties({ message: /expected type 'string' for regexp match/ });
  }

  @TestCase(
    { one: "321" },
    { one: /321/ },
    /regular expression should not match/
  )
  @TestCase(
    { one: 321 },
    { two: 742, one: 321 },
    /should not have matching value/
  )
  public notWithPropertiesNegates(
    object: any,
    notExpected: any,
    expectedRegexp: RegExp
  ) {
    const expect = Expect(object);
    Expect(() => expect.not.with.properties(notExpected))
      .to.throw(MatchError)
      .with.properties({ message: expectedRegexp });
  }
}
