import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../../core/alsatian-core";
import { EqualMatchError } from "../../../../core/errors/equal-match-error";

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
}
