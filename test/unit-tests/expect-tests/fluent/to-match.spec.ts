import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors";

export class ToMatchTests {
  @TestCase("asdfasdf", /asdf/)
  public matchesString(target: string, regexp: RegExp) {
    const expect = Expect(target);

    Expect(() => expect.to.match(regexp)).not.to.throw();
  }

  @TestCase("asdfasdf", /^asdf$/)
  public doesNotMatchString(target: string, regexp: RegExp) {
    const expect = Expect(target);

    Expect(() => expect.to.match(regexp))
      .to.throw(MatchError)
      .with.properties({
        message: /should match/
      });
  }

  @TestCase({ 123: 456 }, /asdf/)
  public errorsOnNonStringType(target: string, regexp: RegExp) {
    const expect = Expect(target);

    Expect(() => expect.to.match(regexp))
      .to.throw(MatchError)
      .with.properties({
        message: /actual value type was not a string/
      });
  }

  @TestCase("asdfasdf", /asdf/)
  public notInvertsMatches(target: string, regexp: RegExp) {
    const expect = Expect(target);

    Expect(() => expect.not.to.match(regexp)).to.throw();
  }
}
