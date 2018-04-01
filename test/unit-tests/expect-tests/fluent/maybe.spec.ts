import {
    FluentExpect as Expect,
    Test,
    TestCase,
    Any
  } from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors";
  
  export class MaybeTests {
    @TestCase(1, false, 2)
    @TestCase(1, true, 1)
    @TestCase("a", true, "a")
    @TestCase("a", false, undefined)
    public Maybe_NegatesWhenFalse(a: any, yayNay: boolean, b: any) {
      Expect(a).maybe(yayNay).to.equal(b);
    }
  
    @TestCase(1, true, 2)
    @TestCase(1, false, 1)
    @TestCase("a", false, "a")
    @TestCase("a", true, undefined)
    public Maybe_UnnegatesWhenTrue(a: any, yayNay: boolean, b: any) {
      const lambda = () => Expect(a).maybe(yayNay).to.equal(b);
      Expect(lambda).to.throw<MatchError>();
    }
  }
  