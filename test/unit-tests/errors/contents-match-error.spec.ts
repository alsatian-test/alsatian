import { Expect, TestCase } from "../../../core/alsatian-core";
import { ContentsMatchError } from "../../../core/errors/contents-match-error";

export class ContentsMatchErrorTests {
  @TestCase([], 1)
  @TestCase([1, 2], 42)
  @TestCase("", "something")
  @TestCase("something", "another thing")
  public shouldMatchMessage(container: any, expectedContent: any) {
    const error = new ContentsMatchError(container, expectedContent, true);

    Expect(error.message).toBe(
      `Expected ${JSON.stringify(container).replace(",", ", ")} ` +
        `to contain ${JSON.stringify(expectedContent)}.`
    );
  }

  @TestCase([1], 1)
  @TestCase([1, 42], 42)
  @TestCase("something", "something")
  @TestCase("something", "thing")
  public shouldNotMatchMessage(container: any, expectedContent: any) {
    const error = new ContentsMatchError(container, expectedContent, false);

    Expect(error.message).toBe(
      `Expected ${JSON.stringify(container).replace(",", ", ")} ` +
        `not to contain ${JSON.stringify(expectedContent)}.`
    );
  }

  @TestCase([1])
  @TestCase([1, 42])
  @TestCase("something")
  @TestCase("something")
  public actualValueContainsTheContainer(container: any) {
    Expect(new ContentsMatchError(container, "", true).actual).toBe(container);
  }

  @TestCase(1)
  @TestCase(42)
  @TestCase("something")
  @TestCase("thing")
  public expectedValueContainsTheExpectedContent(expectedContent: any) {
    Expect(new ContentsMatchError("", expectedContent, true).expected).toBe(
      expectedContent
    );
  }
}
