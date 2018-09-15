import {
  Expect,
  Test,
  EmptyMatcher,
  SpyOn,
  Any
} from "../../../core/alsatian-core";
import { TestItemBuilder } from "../../builders/test-item-builder";

export class ToBeEmptyTests {
  @Test()
  public emptyShouldReportMatchForEmptyArray() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher([], testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @Test()
  public emptyShouldReportNonMatchForNonEmptyArray() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher([0], testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      'Expected "[0]" to be empty.',
      Any,
      Any
    );
  }

  @Test()
  public notEmptyShouldReportNonMatchForEmptyArray() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher([], testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      'Expected "[]" not to be empty.',
      Any,
      Any
    );
  }

  @Test()
  public notEmptyShouldReportMatchForNonEmptyArray() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher([0], testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @Test()
  public emptyShouldReportMatchForEmptyString() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher("", testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @Test()
  public emptyShouldReportNonMatchForNonEmptyString() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher("string", testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      'Expected "string" to be empty.',
      Any,
      Any
    );
  }

  @Test()
  public notEmptyShouldReportNonMatchForEmptyString() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher("", testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      'Expected "" not to be empty.',
      Any,
      Any
    );
  }

  @Test()
  public notEmptyShouldReportMatchForNonEmptyString() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher("string", testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @Test()
  public emptyShouldReportMatchForEmptyObject() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher({}, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @Test()
  public emptyShouldReportNonMatchForNonEmptyObject() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher({ a: true }, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      'Expected "{"a":true}" to be empty.',
      Any,
      Any
    );
  }

  @Test()
  public notEmptyShouldReportNonMatchForEmptyObject() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher({}, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      'Expected "{}" not to be empty.',
      Any,
      Any
    );
  }

  @Test()
  public notEmptyShouldReportMatchForNonEmptyObject() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher({ a: true }, testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @Test()
  public emptyShouldReportMatchForEmptyMap() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher(new Map(), testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @Test()
  public emptyShouldReportNonMatchForNonEmptyMap() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher(new Map([["key", "value"]]), testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      'Expected "Map<1>" to be empty.',
      Any,
      Any
    );
  }

  @Test()
  public notEmptyShouldReportNonMatchForEmptyMap() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher(new Map(), testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      'Expected "Map<0>" not to be empty.',
      Any,
      Any
    );
  }

  @Test()
  public notEmptyShouldReportMatchForNonEmptyMap() {
    const testItem = new TestItemBuilder().build();
    const matcher = new EmptyMatcher(new Map([["key", "value"]]), testItem);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toBeEmpty();

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }
}
