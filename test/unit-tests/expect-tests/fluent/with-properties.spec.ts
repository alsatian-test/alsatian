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
    /regular expression at path.*should match/
  )
  @TestCase(
    { 123: 653, depth: { deeper: 321 } },
    { 123: 653, depth: { deeper: "wrong" } },
    /property deeper at path '\$.depth.deeper' should equal/
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
    const thing = { one: "two" };
    const actualValue = { one: "two" };
    const expect = Expect(actualValue).with;
    SpyOn(expect, "_properties");
    expect.allProperties(thing);
    //FIXME gross:
    OriginalExpect(<()=>any>(<any>expect)["_properties"]).toHaveBeenCalledWith(actualValue, thing, Any(Array));
  }

  @Test()
  public failsWhenRegexpsDontMatch() {
    const expect = Expect({ one: /123/ });
    Expect(() => expect.with.properties({ one: /321/ }))
      .to.throw(MatchError)
      .with.properties({ message: /regular expressions at path.*should match/ });
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
    /regular expression at path.*should not match/
  )
  @TestCase(
    { one: 321 },
    { two: 742, one: 321 },
    /should not equal/
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

  @TestCase({ one: { two: { three: 321 } } }, { one: { two: { three: 0 }}}, /\$.one.two.three/)
  @TestCase({ four: [0, 1, { five: 321 }] }, { four: [0, 1, { five: 0 } ] }, /\$.four.2.five/)
  @TestCase({ one: [ ]}, { one: [ { prop: "not there" } ] }, /property '0' should be defined at path '\$.one.0'/)
  public errorMessageRevealsNesting(object: any, expectAttempt: any, expectedPath: RegExp) {
    const expect = Expect(object);
    Expect(() => expect.with.properties(expectAttempt))
      .to.throw(MatchError)
      .with.properties({ message: expectedPath });
  }

  @Test()
  public booleanLambdaInvertsMessageWhenInverted() {
    const expect = Expect({ "one": "two" });
    Expect(() => expect.not.with.properties({ one: () => true }))
      .to.throw(MatchError)
      .with.properties({ message: /failed \(inverted\) boolean lambda assertion/ });
  }

  @Test()
  public nestedExpectFailsCaughtAndWrapped() {
    const expect = Expect({ one: "two" });
    const lambda = () => expect.with.properties({ one: o => Expect(o).to.equal("three") });
    Expect(lambda)
      .to.throw(MatchError)
      .with.properties({ message: /Property at path '\$.one': failed nested expectation./});
  }

  @Test()
  public nestedExpectThrowsCaughtAndWrapped() {
    const expect = Expect({ one: "two" });
    const lambda = () => expect.with.properties({ one: o => { throw new Error() } });
    Expect(lambda)
      .to.throw(MatchError)
      .with.properties({ message: /Property at path '\$.one': threw unexpected error./});
  }

  @Test()
  public nestedExpectPassNoError() {
    const expect = Expect({ one: "two" });
    const lambda = () => expect.with.properties({ one: o => Expect(o).to.equal("two") });
    Expect(lambda)
      .not.to.throw(MatchError);
  }

  @TestCase({ one: (o: any) => Expect(o).to.equal("two") })
  @TestCase({ one: (o: any) => { /* no op */ } })
  @TestCase({ one: (o: any) => true })
  public negatedNestedExpectNoErrorFails() {
    const expect = Expect({ one: "two" });
    const lambda = () => expect.not.with.properties({ one: o => Expect(o).to.equal("two") });
    Expect(lambda)
      .to.throw(MatchError)
      .with.properties({ message: /Property at path '\$.one': expected lambda to return false, or yield a failed nested expectation or error/ })
  }
}
