import { Expect, Test, TestCase, TestFixture } from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors/match-error";

@TestFixture("Expect.fail() tests")
export class ExpectFailTests {

   @TestCase("something went wrong")
   @TestCase("another thing that's much worse")
   @Test("throws a match error with the given message")
   public definedShouldNotThrowError(message: string) {
      Expect(() => Expect.fail(message)).toThrowError(MatchError, message);
   }
}
