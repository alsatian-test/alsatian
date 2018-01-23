import { Expect, TestCase } from "../../../core/alsatian-core";
import { ContentsMatchError } from "../../../core/errors/contents-match-error";

export class ToContainTests {
  @TestCase([], 1)
  @TestCase([1, 2], 42)
  public shouldContainArrayItemAndDoesNotThrows<T>(
    actualValue: Array<T>,
    expectedContent: T
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.toContain(expectedContent)).toThrowError(
      ContentsMatchError,
      `Expected ${JSON.stringify(actualValue).replace(
        ",",
        ", "
      )} to contain ${JSON.stringify(expectedContent)}.`
    );
  }

  @TestCase("", "something")
  @TestCase("something", "another thing")
  public shouldContainStringAndDoesNotThrow(
    actualValue: string,
    expectedContent: string
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.toContain(expectedContent)).toThrowError(
      ContentsMatchError,
      `Expected ${JSON.stringify(actualValue).replace(
        ",",
        ", "
      )} to contain ${JSON.stringify(expectedContent)}.`
    );
  }

  @TestCase([1], 1)
  @TestCase([1, 42], 42)
  public shouldContainArrayItemAndDoesDoesNotThrow<T>(
    actualValue: Array<T>,
    expectedContent: T
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.toContain(expectedContent)).not.toThrow();
  }

  @TestCase("something", "something")
  @TestCase("something", "thing")
  public shouldContainStringAndDoesDoesNotThrow(
    actualValue: string,
    expectedContent: string
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.toContain(expectedContent)).not.toThrow();
  }

  @TestCase([], 1)
  @TestCase([1, 2], 42)
  public shouldNotContainArrayItemAndDoesNotDoesNotThrow<T>(
    actualValue: Array<T>,
    expectedContent: T
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.not.toContain(expectedContent)).not.toThrow();
  }

  @TestCase("", "something")
  @TestCase("something", "another thing")
  public shouldNotContainStringAndDoesNotDoesNotThrow(
    actualValue: string,
    expectedContent: string
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.not.toContain(expectedContent)).not.toThrow();
  }

  @TestCase([1], 1)
  @TestCase([1, 42], 42)
  public shouldNotContainArrayItemAndDoesThrows<T>(
    actualValue: Array<T>,
    expectedContent: T
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.not.toContain(expectedContent)).toThrowError(
      ContentsMatchError,
      `Expected ${JSON.stringify(actualValue).replace(",", ", ")} ` +
        `not to contain ${JSON.stringify(expectedContent)}.`
    );
  }

  @TestCase("something", "something")
  @TestCase("something", "thing")
  public shouldNotContainStringAndDoesThrow(
    actualValue: string,
    expectedContent: string
  ) {
    const expect = Expect(actualValue);

    Expect(() => expect.not.toContain(expectedContent)).toThrowError(
      ContentsMatchError,
      `Expected ${JSON.stringify(actualValue).replace(",", ", ")} ` +
        `not to contain ${JSON.stringify(expectedContent)}.`
    );
  }

  @TestCase([], 1)
  @TestCase([1, 2], 42)
  public shouldBeTruthyArrayActualValueSet<T>(
    container: Array<T>,
    expectedContent: T
  ) {
    let contentsError: ContentsMatchError;

    try {
      Expect(container).toContain(expectedContent);
    } catch (error) {
      contentsError = error;
    }

    Expect(contentsError).toBeDefined();
    Expect(contentsError).not.toBeNull();
    Expect(contentsError.actual).toBe(container);
  }

  @TestCase("", "something")
  @TestCase("something", "another thing")
  public shouldBeTruthyStringActualValueSet(
    container: string,
    expectedContent: string
  ) {
    let contentsError: ContentsMatchError;

    try {
      Expect(container).toContain(expectedContent);
    } catch (error) {
      contentsError = error;
    }

    Expect(contentsError).toBeDefined();
    Expect(contentsError).not.toBeNull();
    Expect(contentsError.actual).toBe(container);
  }

  @TestCase([1], 1)
  @TestCase([1, 42], 42)
  public shouldNotBeTruthyArrayActualValueSet<T>(
    container: Array<T>,
    expectedContent: T
  ) {
    let contentsError: ContentsMatchError;

    try {
      Expect(container).not.toContain(expectedContent);
    } catch (error) {
      contentsError = error;
    }

    Expect(contentsError).toBeDefined();
    Expect(contentsError).not.toBeNull();
    Expect(contentsError.actual).toBe(container);
  }

  @TestCase("something", "something")
  @TestCase("something", "thing")
  public shouldNotBeTruthyStringActualValueSet(
    container: string,
    expectedContent: string
  ) {
    let contentsError: ContentsMatchError;

    try {
      Expect(container).not.toContain(expectedContent);
    } catch (error) {
      contentsError = error;
    }

    Expect(contentsError).toBeDefined();
    Expect(contentsError).not.toBeNull();
    Expect(contentsError.actual).toBe(container);
  }

  @TestCase([], 1)
  @TestCase([1, 2], 42)
  public shoulContainExpectedValueSetToArrayItemExpectedContent<T>(
    container: Array<T>,
    expectedContent: T
  ) {
    let contentsError: ContentsMatchError;

    try {
      Expect(container).toContain(expectedContent);
    } catch (error) {
      contentsError = error;
    }

    Expect(contentsError).toBeDefined();
    Expect(contentsError).not.toBeNull();
    Expect(contentsError.expected).toBe(expectedContent);
  }

  @TestCase("", "something")
  @TestCase("something", "another thing")
  public shoulContainExpectedValueSetToStringExpectedContent(
    container: string,
    expectedContent: string
  ) {
    let contentsError: ContentsMatchError;

    try {
      Expect(container).toContain(expectedContent);
    } catch (error) {
      contentsError = error;
    }

    Expect(contentsError).toBeDefined();
    Expect(contentsError).not.toBeNull();
    Expect(contentsError.expected).toBe(expectedContent);
  }

  @TestCase([1], 1)
  @TestCase([1, 42], 42)
  public shouldNotConrtainExpectedValueSetToArrayItemExpectedContent<T>(
    container: Array<T>,
    expectedContent: T
  ) {
    let contentsError: ContentsMatchError;

    try {
      Expect(container).not.toContain(expectedContent);
    } catch (error) {
      contentsError = error;
    }

    Expect(contentsError).toBeDefined();
    Expect(contentsError).not.toBeNull();
    Expect(contentsError.expected).toBe(expectedContent);
  }

  @TestCase("something", "something")
  @TestCase("something", "thing")
  public shouldNotContainExpectedValueSetToStringExpectedContent(
    container: string,
    expectedContent: string
  ) {
    let contentsError: ContentsMatchError;

    try {
      Expect(container).not.toContain(expectedContent);
    } catch (error) {
      contentsError = error;
    }

    Expect(contentsError).toBeDefined();
    Expect(contentsError).not.toBeNull();
    Expect(contentsError.expected).toBe(expectedContent);
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase({})
  @TestCase({ an: "object" })
  public checkingNonStringOrArraysContainShouldThrow(container: any) {
    const EXPECT = Expect([]);
    (EXPECT as any)._actualValue = container;

    Expect(() => EXPECT.toContain("something")).toThrowError(
      TypeError,
      "toContain must only be used to check whether strings or arrays contain given contents."
    );
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase({})
  @TestCase({ an: "object" })
  public checkingNonStringOrArraysDoNotContainShouldThrow(container: any) {
    const EXPECT = Expect([]);
    (EXPECT as any)._actualValue = container;

    Expect(() => EXPECT.not.toContain("something")).toThrowError(
      TypeError,
      "toContain must only be used to check whether strings or arrays contain given contents."
    );
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase({})
  @TestCase({ an: "object" })
  @TestCase([])
  @TestCase(["an", "array"])
  public checkingStringContainsNonStringShouldThrow(expectedContent: any) {
    Expect(() => Expect("something").toContain(expectedContent)).toThrowError(
      TypeError,
      "toContain cannot check whether a string contains a non string value."
    );
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase({})
  @TestCase({ an: "object" })
  @TestCase([])
  @TestCase(["an", "array"])
  public checkingStringDoesNotContainsNonStringShouldThrow(
    expectedContent: any
  ) {
    Expect(() =>
      Expect("something").not.toContain(expectedContent)
    ).toThrowError(
      TypeError,
      "toContain cannot check whether a string contains a non string value."
    );
  }
}
