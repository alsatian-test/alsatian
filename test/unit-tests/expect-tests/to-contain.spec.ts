import {
  Expect,
  TestCase,
  ContainerMatcher,
  SpyOn,
  Any
} from "../../../core/alsatian-core";
import { TestItemBuilder } from "../../builders/test-item-builder";

export class ToContainTests {
  @TestCase([], 1)
  @TestCase([1, 2], 42)
  public shouldContainArrayItemAndDoesNotReportsNonMatch<T>(
    actualValue: Array<T>,
    expectedContent: T
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(actualValue);
    SpyOn(testItem, "registerMatcher");
    matcher.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      `Expected ${JSON.stringify(actualValue).replace(
        ",",
        ", "
      )} to contain ${JSON.stringify(expectedContent)}.`,
      expectedContent,
      actualValue
    );
  }

  @TestCase("", "something")
  @TestCase("something", "another thing")
  public shouldContainStringAndDoesNotReportsNonMatch(
    actualValue: string,
    expectedContent: string
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(actualValue);
    SpyOn(testItem, "registerMatcher");
    matcher.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      `Expected ${JSON.stringify(actualValue).replace(
        ",",
        ", "
      )} to contain ${JSON.stringify(expectedContent)}.`,
      expectedContent,
      actualValue
    );
  }

  @TestCase([1], 1)
  @TestCase([1, 42], 42)
  public shouldContainArrayItemAndDoesReportsMatch<T>(
    actualValue: Array<T>,
    expectedContent: T
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(actualValue);
    SpyOn(testItem, "registerMatcher");
    matcher.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @TestCase("something", "something")
  @TestCase("something", "thing")
  public shouldContainStringAndDoesReportsMatch(
    actualValue: string,
    expectedContent: string
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(actualValue);
    SpyOn(testItem, "registerMatcher");
    matcher.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @TestCase([], 1)
  @TestCase([1, 2], 42)
  public shouldNotContainArrayItemAndDoesNotReportsMatch<T>(
    actualValue: Array<T>,
    expectedContent: T
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(actualValue);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @TestCase("", "something")
  @TestCase("something", "another thing")
  public shouldNotContainStringAndDoesNotReportsMatch(
    actualValue: string,
    expectedContent: string
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(actualValue);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @TestCase([1], 1)
  @TestCase([1, 42], 42)
  public shouldNotContainArrayItemAndDoesThrows<T>(
    actualValue: Array<T>,
    expectedContent: T
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(actualValue);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      `Expected ${JSON.stringify(actualValue).replace(
        ",",
        ", "
      )} not to contain ${JSON.stringify(expectedContent)}.`,
      expectedContent,
      actualValue
    );
  }

  @TestCase("something", "something")
  @TestCase("something", "thing")
  public shouldNotContainStringAndDoesThrow(
    actualValue: string,
    expectedContent: string
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(actualValue);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      `Expected ${JSON.stringify(actualValue).replace(
        ",",
        ", "
      )} not to contain ${JSON.stringify(expectedContent)}.`,
      expectedContent,
      actualValue
    );
  }

  @TestCase([], 1)
  @TestCase([1, 2], 42)
  public shouldBeTruthyArrayActualValueSet<T>(
    container: Array<T>,
    expectedContent: T
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(container);
    SpyOn(testItem, "registerMatcher");
    matcher.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      Any,
      Any,
      container
    );
  }

  @TestCase("", "something")
  @TestCase("something", "another thing")
  public shouldBeTruthyStringActualValueSet(
    container: string,
    expectedContent: string
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(container);
    SpyOn(testItem, "registerMatcher");
    matcher.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      Any,
      Any,
      container
    );
  }

  @TestCase([1], 1)
  @TestCase([1, 42], 42)
  public shouldNotBeTruthyArrayActualValueSet<T>(
    container: Array<T>,
    expectedContent: T
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(container);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      Any,
      Any,
      container
    );
  }

  @TestCase("something", "something")
  @TestCase("something", "thing")
  public shouldNotBeTruthyStringActualValueSet(
    container: string,
    expectedContent: string
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(container);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      Any,
      Any,
      container
    );
  }

  @TestCase([], 1)
  @TestCase([1, 2], 42)
  public shoulContainExpectedValueSetToArrayItemExpectedContent<T>(
    container: Array<T>,
    expectedContent: T
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(container);
    SpyOn(testItem, "registerMatcher");
    matcher.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      Any,
      expectedContent,
      Any
    );
  }

  @TestCase("", "something")
  @TestCase("something", "another thing")
  public shoulContainExpectedValueSetToStringExpectedContent(
    container: string,
    expectedContent: string
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(container);
    SpyOn(testItem, "registerMatcher");
    matcher.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      Any,
      expectedContent,
      Any
    );
  }

  @TestCase([1], 1)
  @TestCase([1, 42], 42)
  public shouldNotConrtainExpectedValueSetToArrayItemExpectedContent<T>(
    container: Array<T>,
    expectedContent: T
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(container);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      Any,
      expectedContent,
      Any
    );
  }

  @TestCase("something", "something")
  @TestCase("something", "thing")
  public shouldNotContainExpectedValueSetToStringExpectedContent(
    container: string,
    expectedContent: string
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new ContainerMatcher(container);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toContain(expectedContent);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      Any,
      expectedContent,
      Any
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
