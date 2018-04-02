import {
  FluentExpect as Expect,
  Test,
  TestCase,
  Any
} from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors";

export class HaveMatchesTests {
  @TestCase("123-321", /(\d+)-(\d+)/)
  public matchesAndReturnsStrings(target: string, regexp: RegExp) {
    const lambda = () =>
      Expect(target)
        .to.haveMatches(regexp)
        .that.has(parts => +parts[2])
        .that.equals(321);

    Expect(lambda).not.to.throw();
  }
}
