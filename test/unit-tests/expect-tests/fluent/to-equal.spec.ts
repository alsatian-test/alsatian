import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../../core/alsatian-core";
import { EqType } from "../../../../core/matchers/fluent";

export class ToEqualTests {
  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(42)
  @TestCase(4.2)
  @TestCase(-4.2)
  @TestCase("")
  @TestCase("something")
  public identicalSimpleTypesDontThrow(value: any) {
    const expect = Expect(value);

    Expect(() => expect.to.equal(value)).not.to.throw();
  }

  @TestCase(0, false)
  @TestCase("", false)
  @TestCase(1, true)
  @TestCase([], false)
  @TestCase([], "")
  @TestCase(["a"], "a")
  public looselyEqual(a: any, b: any) {
    const expect = Expect(a);

    Expect(() => expect.to.equal(b, EqType.loosely)).not.to.throw();
  }

  @TestCase(0, 1)
  @TestCase("", "a")
  @TestCase(false, true)
  @TestCase([], [false])
  @TestCase(["a"], "b")
  public looselyInequal(a: any, b: any) {
    const expect = Expect(a);

    Expect(() => expect.to.equal(b, EqType.loosely))
      .to.throw()
      .with.properties({ message: /should loosely \(==\) equal/ });
  }

  @TestCase(0, false)
  @TestCase("", false)
  @TestCase(1, true)
  @TestCase([], false)
  @TestCase([], "")
  @TestCase(["a"], "a")
  public strictlyInequal(a: any, b: any) {
    const expect = Expect(a);

    Expect(() => expect.to.equal(b, EqType.strictly)).to.throw();
  }

  @TestCase({ one: 123, two: { 456: 789 } }, { one: 123, two: { 456: 789 } })
  @TestCase({ one: 123, two: "asdf" }, { one: 123, two: "asdf" })
  public deepStrictlyEqual(a: any, b: any) {
    const expect = Expect(a);

    Expect(() => expect.to.equal(b, EqType.deepStrictly)).not.to.throw();
  }

  @TestCase({ one: 123, two: { 456: 789 } }, { one: 123 })
  @TestCase({ one: 123, two: { 456: 789 } }, { one: 123, two: { 456: 788 } })
  public deepStrictlyInequal(a: any, b: any) {
    const expect = Expect(a);

    Expect(() => expect.to.equal(b, EqType.deepStrictly))
      .to.throw()
      .with.properties({ message: /should deeply equal/ });
  }

  @TestCase({ one: "", two: { 456: "" } }, { one: false, two: { 456: [] } })
  @TestCase({ one: [], two: "asdf" }, { one: false, two: "asdf" })
  @TestCase({}, {})
  @TestCase(null, null)
  @TestCase(undefined, undefined)
  @TestCase(undefined, null)
  public deepLooselyEqual(a: any, b: any) {
    const expect = Expect(a);

    Expect(() => expect.to.equal(b, EqType.deepLoosely)).not.to.throw();
  }

  @TestCase({ one: "", two: { 456: "" } }, { one: "", two: { 456: ["asdf"] } })
  @TestCase({ one: [], two: "asdf" }, { one: [1], two: "asdf" })
  @TestCase({}, "{}")
  @TestCase(null, "null")
  @TestCase(undefined, false)
  public deepLooselyInequal(a: any, b: any) {
    const expect = Expect(a);

    Expect(() => expect.to.equal(b, EqType.deepLoosely))
      .to.throw()
      .with.properties({ message: /should deeply equal/ });
  }

  @Test()
  public UnrecognizedEqTypeThrows() {
    const expect = Expect(123);

    Expect(() => expect.to.equal(123, "bogus" as EqType))
      .to.throw()
      .with.properties({ message: /Unrecognized EqType: bogus/ });
  }
}
