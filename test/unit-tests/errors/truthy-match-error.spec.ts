import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { TruthyMatchError } from "../../../core/errors/truthy-match-error";

export class TruthyMatchErrorTests {
  @TestCase(0)
  @TestCase(-1)
  @TestCase(false)
  @TestCase("")
  public shouldBeTruthyMessage(actualValue: any) {
    const error = new TruthyMatchError(actualValue, true);

    Expect(error.message).toBe(
      "Expected " + JSON.stringify(actualValue) + " to be truthy."
    );
  }

  @TestCase(1)
  @TestCase(42)
  @TestCase(true)
  @TestCase("something")
  public shouldNotBeTruthyMessage(actualValue: any) {
    const error = new TruthyMatchError(actualValue, false);

    Expect(error.message).toBe(
      "Expected " + JSON.stringify(actualValue) + " not to be truthy."
    );
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase("")
  @TestCase("something")
  @TestCase({})
  @TestCase({ an: "object" })
  @TestCase([])
  @TestCase(["an", "array"])
  public actualValueSet(actualValue: any) {
    const error = new TruthyMatchError(actualValue, false);

    Expect(error.actual).toBe(actualValue);
  }

  @Test()
  public expectedValueSetToTruthyIfShouldMatch() {
    const error = new TruthyMatchError(null, true);

    Expect(error.expected).toBe("truthy");
  }

  @Test()
  public expectedValueSetToFalsyIfShouldNotMatch() {
    const error = new TruthyMatchError("something", false);

    Expect(error.expected).toBe("falsy");
  }
}
