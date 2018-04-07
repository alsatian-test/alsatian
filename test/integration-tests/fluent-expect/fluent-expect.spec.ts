import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../core/alsatian-core";

class MyError extends Error {}

/**
 * Verifies different ways of stringing together the fluent API.
 * Mainly checks that we haven't messed up return types in all our fiddling around. :)
 */
export class FluentExpect {
  @Test()
  public EntityAssertsReturnToMainContext() {
    Expect(() => {
      Expect({ something: 54, other: 64 })
        .not.to.equal({ something: 54, other: 63 })
        .and.to.satisfy(o => o.other === 64);
    }).not.to.throw();
  }

  @Test()
  public PropertyAssertsReturnToMainContext() {
    Expect(() => {
      Expect({ a: 123, b: 256 })
        .with.properties({ a: a => a > 5 })
        .and.with.properties({ b: b => b < 300 })
        .and.not.with.allProperties({ a: a => a > 500, b: b => b > 500 });
    }).not.to.throw();
  }
}
