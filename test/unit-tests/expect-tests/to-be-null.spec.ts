import {
  Expect,
  Test,
  TestCase,
  Matcher,
  SpyOn,
  Any
} from "../../../core/alsatian-core";
import { TestItemBuilder } from "../../builders/test-item-builder";

export class ToBeNullTests {
  @Test()
  public nullShouldRecordMatch() {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(null, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeNull();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
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
  public nullShouldRecordNonMatchForNonNullValues(value: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(value, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeNull();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(false, Any, Any, Any);
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
  public nullShouldRecordNonMatchWithCorrectMessageNonNullValues(value: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(value, testItem);
    let stringifiedArgument = JSON.stringify(value);

    if (stringifiedArgument) {
      stringifiedArgument = stringifiedArgument.replace(",", ", ");
    }

    const expectedErrorMessage =
      "Expected " + stringifiedArgument + " to be null.";

    SpyOn(testItem, "registerMatcher");

    matcher.toBeNull();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      expectedErrorMessage,
      null,
      value
    );
  }

  @Test()
  public notNullShouldRecordNonMatch() {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(null, testItem);
    SpyOn(testItem, "registerMatcher");

    const expectedErrorMessage = "Expected null not to be null.";

    matcher.not.toBeNull();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      expectedErrorMessage,
      null,
      null
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
  public notNullShouldRecordMatchForNonNullValues(value: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(value, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeNull();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(false, Any, Any, Any);
  }
}
