import { Expect, Test, TestCase, SpyOn, Matcher, Any } from "../../../core/alsatian-core";
import { TestItemBuilder } from "../../builders/test-item-builder";

export class ToBeTests {
  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(42)
  @TestCase(4.2)
  @TestCase(-4.2)
  @TestCase("")
  @TestCase("something")
  public identicalSimpleTypesRecordsMatch(value: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(value, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBe(value);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @TestCase(undefined, undefined)
  @TestCase(null, null)
  @TestCase(0, 0)
  @TestCase(42, 42)
  @TestCase(4.2, 4.2)
  @TestCase(-4.2, -4.2)
  @TestCase("", "")
  @TestCase("something", "something")
  public matchingSimpleTypesRecordsMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBe(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @Test()
  public differentValuesRecordsNonMatch() {
    
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(1, testItem);
    SpyOn(testItem, "registerMatcher");
    
    matcher.toBe(2);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      "Expected 1 to be 2.",
      2,
      1
    );
  }

  @TestCase("something", "something else")
  @TestCase("", "something")
  @TestCase(0, 42)
  @TestCase(42, 0)
  public differentSimpleValuesRecordNonMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBe(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(false, Any, Any, Any);
  }

  @TestCase("something", "something else")
  @TestCase("", "something")
  @TestCase(0, 42)
  @TestCase(42, 0)
  public differentSimpleValuesRecordsNonMatchWithMessage(
    expected: any,
    actual: any
  ) {
    
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual, testItem);
    SpyOn(testItem, "registerMatcher");
    
    matcher.toBe(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      `Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}.`,
      expected,
      actual
    );
  }

  @TestCase(undefined, null)
  @TestCase(null, undefined)
  @TestCase(42, "something")
  @TestCase("something", 42)
  public differentSimpleTypesRecordsNonMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBe(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(false, Any, Any, Any);
  }

  @TestCase({})
  @TestCase({ with: "something" })
  @TestCase({
    with: { something: "more" },
    complex: "!",
    foSho: true,
    answer: 42
  })
  @TestCase([])
  @TestCase([1, 2, 3])
  @TestCase([{ with: "something" }, { and: "something", else: "!" }])
  public identicalComplexTypesRecordsMatch(value: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(value, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBe(value);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @TestCase({}, {})
  @TestCase({ with: "something" }, { with: "something" })
  @TestCase(
    { with: { something: "more" }, complex: "!", foSho: true, answer: 42 },
    { with: { something: "more" }, complex: "!", foSho: true, answer: 42 }
  )
  @TestCase([], [])
  @TestCase([1, 2, 3], [1, 2, 3])
  @TestCase(
    [{ with: "something" }, { and: "something", else: "!" }],
    [{ with: "something" }, { and: "something", else: "!" }]
  )
  public matchingComplexTypesRecordsNonMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBe(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(false, Any, Any, Any);
  }

  @TestCase({}, { with: "something" })
  @TestCase({ with: "something" }, {})
  @TestCase([], [1, 2, 3])
  @TestCase([1, 2, 3], [])
  public differentComplexValuesRecordsNonMatchWithCorrectError(
    expected: any,
    actual: any
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual, testItem);
    SpyOn(testItem, "registerMatcher");
    
    matcher.toBe(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      `Expected ${JSON.stringify(actual).replace(/,/g, ", ")} ` +
        `to be ${JSON.stringify(expected).replace(/,/g, ", ")}.`,
      expected,
      actual
    );
  }

  @TestCase({}, [])
  @TestCase([], {})
  @TestCase({ with: "something" }, [1, 2, 3])
  @TestCase([1, 2, 3], { with: "something" })
  @TestCase([], { with: "something" })
  @TestCase([1, 2, 3], {})
  public differentComplexTypesRecordsNonMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBe(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(false, Any, Any, Any);
  }
}
