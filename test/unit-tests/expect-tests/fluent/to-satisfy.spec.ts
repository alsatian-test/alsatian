import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors";

export class ToSatifyTests {
  @TestCase((t: any) => true)
  @TestCase((t: any) => "truthy")
  public shouldMatchPredicate(predicate: (t: any) => boolean) {
    const expect = Expect(123);

    Expect(() => expect.to.satisfy(predicate)).not.to.throw();
  }

  @TestCase((t: any) => false)
  @TestCase((t: any) => "" /* falsy */)
  public shouldNotMatchPredicate(predicate: (t: any) => boolean) {
    const expect = Expect(123);

    Expect(() => expect.to.satisfy(predicate))
      .to.throw()
      .with.properties({
        message: /should match lambda/
      });
  }
}
