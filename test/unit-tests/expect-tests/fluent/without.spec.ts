import {
    FluentExpect as Expect,
    Test,
    TestCase,
    FocusTests,
    Any
  } from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors";
  
  export class WithoutTests {
    @TestCase({one: 2}, {two: 1}, false)
    @TestCase({one: 2}, {one: 2}, true)
    public without_negatesReturnsProperties(a: any, b: any, ok: boolean) {
      const lambda = () => Expect(a).without.properties(b);
      Expect(lambda).maybe(ok).to.throw(MatchError);
    }
  }
  