import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { ExactMatchError } from "../../../core/errors/exact-match-error";

export class ToBeDefinedTests {
  @TestCase(null)
  @TestCase(0)
  @TestCase(42)
  @TestCase(-42)
  @TestCase("")
  @TestCase("something")
  @TestCase({})
  @TestCase({ with: "something" })
  @TestCase([])
  @TestCase([1])
  @TestCase([1, 2])
  public definedShouldNotThrowError(value: any) {
    const expect = Expect(value);

    Expect(() => expect.toBeDefined()).not.toThrow();
  }

  @Test()
  public definedShouldThrowErrorForUndefined() {
    const expect = Expect(undefined);

    Expect(() => expect.toBeDefined()).toThrow();
  }

  @Test()
  public definedShouldThrowCorrectErrorWithCorrectMessageForUndefined() {
    const expect = Expect(undefined);

    const expectedErrorMessage = "Expected undefined not to be undefined.";

    Expect(() => expect.toBeDefined()).toThrowError(
      ExactMatchError,
      expectedErrorMessage
    );
  }

  @TestCase(null)
  @TestCase(0)
  @TestCase(42)
  @TestCase(-42)
  @TestCase("")
  @TestCase("something")
  @TestCase({})
  @TestCase({ with: "something" })
  @TestCase([])
  @TestCase([1])
  @TestCase([1, 2])
  public notDefinedShouldThrowError(value: any) {
    const expect = Expect(value);

    const expectedErrorMessage =
      "Expected " +
      JSON.stringify(value).replace(",", ", ") +
      " to be undefined.";

    Expect(() => expect.not.toBeDefined()).toThrowError(
      ExactMatchError,
      expectedErrorMessage
    );
  }

  @Test()
  public notDefinedShouldNotThrowErrorForUndefined() {
    const expect = Expect(undefined);

    Expect(() => expect.not.toBeDefined()).not.toThrow();
  }
}
