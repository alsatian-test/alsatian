import {
  Expect,
  Test,
  TestCase,
  Any,
  Matcher,
  SpyOn,
  FocusTest
} from "../../../core/alsatian-core";
import { stringify } from "../../../core/stringification";
import { TestItemBuilder } from "../../builders/test-item-builder";

export class ToEqualTests {
  // @FocusTest
  @Test()
  public noExpectTest() {
    // console.log("I ain't doing anything")
  }

  //@FocusTest
  @Test()
  public test() {
    Expect({ notTest: undefined, testTwo: 2 }).toEqual({ test: undefined });
  }

  ///@FocusTest
  @Test()
  public test2() {
    // console.log("to be or not to be, that is the question")

    Expect("abd").toEqual("ace");
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(42)
  @TestCase(4.2)
  @TestCase(-4.2)
  @TestCase("")
  @TestCase("something")
  public identicalSimpleTypesReportsMatch(value: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(value);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(value);

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
  public matchingSimpleTypesReportsMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @Test()
  public differentValuesReportsNonMatch() {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(1);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(2);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      true,
      "Expected 1 to be equal to 2.",
      2,
      1
    );
  }

  @TestCase("something", "something else")
  @TestCase("", "something")
  @TestCase(0, 42)
  @TestCase(42, 0)
  public differentSimpleValuesReportsNonMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      "Expected " +
        stringify(actual) +
        " to be equal to " +
        stringify(expected) +
        ".",
      expected,
      actual
    );
  }

  @TestCase(undefined, null)
  @TestCase(null, undefined)
  public nullAndUndefinedReportsMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.not.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @TestCase(42, "something")
  @TestCase("something", 42)
  public differentSimpleTypesReportsNonMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      "Expected " +
        stringify(actual) +
        " to be equal to " +
        stringify(expected) +
        ".",
      expected,
      actual
    );
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
  public identicalComplexTypesReportsMatch(value: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(value);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(value);

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
  public matchingComplexTypesReportsMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @TestCase({}, { with: "something" })
  @TestCase({ with: "something" }, {})
  @TestCase([], [1, 2, 3])
  @TestCase([1, 2, 3], [])
  public differentComplexValuesReportsNonMatchWithCorrectMessage(
    expected: any,
    actual: any
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      "Expected " +
        stringify(actual) +
        " to be equal to " +
        stringify(expected) +
        ".",
      expected,
      actual
    );
  }

  @TestCase({}, { with: "something" })
  @TestCase({ with: "something" }, {})
  @TestCase([], [1, 2, 3])
  @TestCase([1, 2, 3], [])
  public differentComplexValuesReportsMatchIfNotEqualRequested(
    expected: any,
    actual: any
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

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
  public matchingComplexTypesReportsNonMatchWithCorrectMessage(
    expected: any,
    actual: any
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      "Expected " +
        stringify(actual) +
        " to be equal to " +
        stringify(expected) +
        ".",
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
  public differentComplexTypesReportsNonMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      "Expected " +
        stringify(actual) +
        " to be equal to " +
        stringify(expected) +
        ".",
      expected,
      actual
    );
  }

  @TestCase({ with: { something: "deep" } }, [1, 2, 3])
  @TestCase([{ this: "that" }], { with: "something" })
  public differentDeepComplexTypesReportsNonMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      "Expected " +
        stringify(actual) +
        " to be equal to " +
        stringify(expected) +
        ".",
      expected,
      actual
    );
  }

  @TestCase(
    { with: { something: "deep" } },
    { with: { something: "different" } }
  )
  @TestCase([{ this: "that" }], [{ this: "and that" }])
  public differentDeepComplexReportsNonMatch(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      "Expected " +
        stringify(actual) +
        " to be equal to " +
        stringify(expected) +
        ".",
      expected,
      actual
    );
  }

  @TestCase(Any(Number), 42)
  @TestCase(Any(String), "something")
  @TestCase(Any(Object).thatMatches("property", 42), {
    property: 42,
    anotherProperty: "something"
  })
  @TestCase(Any(Object).thatMatches({ anotherProperty: "something" }), {
    property: 42,
    anotherProperty: "something"
  })
  public canMatchWithAny(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @TestCase(Any(Number), "something")
  @TestCase(Any(String), 42)
  @TestCase(Any(Object).thatMatches("property", 42), {
    property: "something",
    anotherProperty: 42
  })
  @TestCase(Any(Object).thatMatches({ anotherProperty: "something" }), {
    property: "something",
    anotherProperty: 42
  })
  public reportsNonMatchForNonMatchesWithAny(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      "Expected " +
        stringify(actual) +
        " to be equal to " +
        stringify(expected) +
        ".",
      expected,
      actual
    );
  }

  @TestCase(
    Any(Number),
    "something",
    'Expected "something" to be equal to Any Number.'
  )
  @TestCase(Any(String), 42, "Expected 42 to be equal to Any String.")
  @TestCase(
    Any(Object).thatMatches("property", 42),
    { property: "something", anotherProperty: 42 },
    `Expected {"property":"something","anotherProperty":42} ` +
      `to be equal to Any Object and with property 'property' equal to '42'.`
  )
  @TestCase(
    Any(Object).thatMatches({ anotherProperty: "something" }),
    { property: "something", anotherProperty: 42 },
    `Expected {"property":"something","anotherProperty":42} ` +
      `to be equal to Any Object and matches '{"anotherProperty":"something"}'.`
  )
  public reportsCorrectMessageNonMatchesWithAny(
    expected: any,
    actual: any,
    errorMessage: string
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      errorMessage,
      expected,
      actual
    );
  }

  @TestCase(Buffer.from([1, 2, 3]), Buffer.from([1, 2, 3]))
  @TestCase(Buffer.from([1, 2, 3]), [1, 2, 3]) // Array
  @TestCase(Buffer.from([1, 2, 3]), "") // String, "" was retrieved from Buffer.from([1, 2, 3]).toString()
  @TestCase(Buffer.from([1, 2, 3]), { 0: 1, 1: 2, 2: 3, length: 3 }) // ArrayLike
  public canMatchWithBuffer(expected: any, actual: any) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(true, Any, Any, Any);
  }

  @TestCase(Buffer.from([1, 2, 3]), null)
  @TestCase(Buffer.from([1, 2, 3]), undefined)
  @TestCase(Buffer.from([1, 2, 3]), 1)
  @TestCase(Buffer.from([1, 2, 3]), {})
  @TestCase(Buffer.from([1, 2, 3]), Buffer.from([1, 2]))
  @TestCase(Buffer.from([1, 2, 3]), [1, 2])
  @TestCase(Buffer.from([1, 2, 3]), "")
  @TestCase(Buffer.from([1, 2, 3]), { 0: 1, 1: 2, length: 2 })
  public throwsErrorsForNonMatchesWithBuffer(expected: any, actual: any) {
    const expect = Expect(actual);

    Expect(() => expect.toEqual(expected)).toThrow();
  }

  @TestCase(
    Buffer.from([1, 2, 3]),
    null,
    `Expected null to be equal to {"type":"Buffer","data":[1,2,3]}.`
  )
  @TestCase(
    Buffer.from([1, 2, 3]),
    undefined,
    `Expected undefined to be equal to {"type":"Buffer","data":[1,2,3]}.`
  )
  @TestCase(
    Buffer.from([1, 2, 3]),
    1,
    `Expected 1 to be equal to {"type":"Buffer","data":[1,2,3]}.`
  )
  @TestCase(
    Buffer.from([1, 2, 3]),
    {},
    `Expected {} to be equal to {"type":"Buffer","data":[1,2,3]}.`
  )
  public reportsNonMatchWithMessageForNonMatchesWithBuffer(
    expected: any,
    actual: any,
    errorMessage: string
  ) {
    const testItem = new TestItemBuilder().build();
    const matcher = new Matcher(actual);
    SpyOn(testItem, "registerMatcher");
    matcher.toEqual(expected);

    Expect(testItem.registerMatcher).toHaveBeenCalledWith(
      false,
      errorMessage,
      expected,
      actual
    );
  }
}
