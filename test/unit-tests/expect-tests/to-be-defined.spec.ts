import {
  Expect,
  Test,
  TestCase,
  Matcher,
  SpyOn,
  Any
} from "../../../core/alsatian-core";
import { TestItem } from "../../../core/running";
import { TestItemBuilder } from "../../builders/test-item-builder";

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
  public definedShouldRecordMatch(value: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(value, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeDefined();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @Test()
  public definedShouldRecordNonMatchForUndefined() {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(undefined, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeDefined();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(false, Any, Any, Any);
  }

  @Test()
  public definedShouldRecordNonMatchWithCorrectMessageForUndefined() {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(undefined, testItem);

    SpyOn(testItem, "registerMatcher");

    matcher.toBeDefined();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      "Expected undefined not to be undefined.",
      undefined,
      undefined
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
  public notDefinedShouldRecordNonMatch(value: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(value, testItem);

    const expectedErrorMessage =
      "Expected " +
      JSON.stringify(value).replace(",", ", ") +
      " to be undefined.";

    SpyOn(testItem, "registerMatcher");

    matcher.not.toBeDefined();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      expectedErrorMessage,
      undefined,
      value
    );
  }

  @Test()
  public notDefinedShouldRecordNonMatchForUndefined() {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(undefined, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toBeDefined();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }
}
