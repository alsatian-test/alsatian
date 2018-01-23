import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { ExactMatchError } from "../../../core/errors/exact-match-error";

export class ToBeNullTests {
  @Test()
  public nullShouldNotThrowError() {
    const expect = Expect(null);

    Expect(() => expect.toBeNull()).not.toThrow();
  }

  @TestCase(undefined)
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
  public nullShouldThrowErrorForNonNullValues(value: any) {
    const expect = Expect(value);

    Expect(() => expect.toBeNull()).toThrow();
  }

  @TestCase(undefined)
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
  public nullShouldThrowCorrectErrorWithCorrectMessageForNonNullValues(
    value: any
  ) {
    const expect = Expect(value);

    let stringifiedArgument = JSON.stringify(value);

    if (stringifiedArgument) {
      stringifiedArgument = stringifiedArgument.replace(",", ", ");
    }

    const expectedErrorMessage =
      "Expected " + stringifiedArgument + " to be null.";

    Expect(() => expect.toBeNull()).toThrowError(
      ExactMatchError,
      expectedErrorMessage
    );
  }

  @Test()
  public notNullShouldThrowError() {
    const expect = Expect(null);

    const expectedErrorMessage = "Expected null not to be null.";

    Expect(() => expect.not.toBeNull()).toThrowError(
      ExactMatchError,
      expectedErrorMessage
    );
  }

  @TestCase(undefined)
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
  public notNullShouldNotThrowErrorForNonNullValues(value: any) {
    const expect = Expect(value);

    Expect(() => expect.not.toBeNull()).not.toThrow();
  }
}
