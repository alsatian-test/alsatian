import { Expect, Test, TestCase } from "../../../../core/alsatian-core";
import { TypeMatcher } from "../../../../core/spying/type-matcher";

export class DerivedError extends Error {
  constructor(public state: any, message?: string) {
    super(message);
  }
}

export class Testable<TA, TB> {
  constructor(public a: TA, public b: TB) {}
}

export class TypeMatcherTestFunctionTests {
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase(-42)
  @TestCase(new Number(0))
  @TestCase(new Number(1))
  @TestCase(new Number(42))
  @TestCase(new Number(-42))
  public numberTypeAndNumberValueReturnsTrue(value: number) {
    const matcher = new TypeMatcher(Number);
    Expect(matcher.test(value)).toBe(true);
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase("")
  @TestCase(new String(""))
  @TestCase("test")
  @TestCase(new String("test"))
  @TestCase(true)
  @TestCase(false)
  @TestCase(new Boolean(true))
  @TestCase(new Boolean(false))
  @TestCase({})
  @TestCase({ an: "object" })
  @TestCase(new Object({}))
  @TestCase(new Object({ an: "object" }))
  @TestCase([])
  @TestCase(["an", "array"])
  @TestCase(new Array([]))
  @TestCase(new Array(["an", "array"]))
  @TestCase(new Error())
  @TestCase(new Error("something went wrong"))
  public numberTypeAndNonNumberValueReturnsTrue(value: any) {
    const matcher = new TypeMatcher(Number);
    Expect(matcher.test(value)).toBe(false);
  }

  @TestCase("")
  @TestCase(new String(""))
  @TestCase("test")
  @TestCase(new String("test"))
  public stringTypeAndStringValueReturnsTrue(value: string) {
    const matcher = new TypeMatcher(String);
    Expect(matcher.test(value)).toBe(true);
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase(-42)
  @TestCase(new Number(0))
  @TestCase(new Number(1))
  @TestCase(new Number(42))
  @TestCase(new Number(-42))
  @TestCase(true)
  @TestCase(false)
  @TestCase(new Boolean(true))
  @TestCase(new Boolean(false))
  @TestCase({})
  @TestCase({ an: "object" })
  @TestCase(new Object({}))
  @TestCase(new Object({ an: "object" }))
  @TestCase([])
  @TestCase(["an", "array"])
  @TestCase(new Array([]))
  @TestCase(new Array(["an", "array"]))
  @TestCase(new Error())
  @TestCase(new Error("something went wrong"))
  public stringTypeAndNonStringValueReturnsTrue(value: any) {
    const matcher = new TypeMatcher(String);
    Expect(matcher.test(value)).toBe(false);
  }

  @TestCase(true)
  @TestCase(false)
  @TestCase(new Boolean(true))
  @TestCase(new Boolean(false))
  public booleanTypeAndBooleanValueReturnsTrue(value: boolean) {
    const matcher = new TypeMatcher(Boolean);
    Expect(matcher.test(value)).toBe(true);
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase(-42)
  @TestCase("")
  @TestCase(new String(""))
  @TestCase("test")
  @TestCase(new String("test"))
  @TestCase(new Number(0))
  @TestCase(new Number(1))
  @TestCase(new Number(42))
  @TestCase(new Number(-42))
  @TestCase({})
  @TestCase({ an: "object" })
  @TestCase(new Object({}))
  @TestCase(new Object({ an: "object" }))
  @TestCase([])
  @TestCase(["an", "array"])
  @TestCase(new Array([]))
  @TestCase(new Array(["an", "array"]))
  @TestCase(new Error())
  @TestCase(new Error("something went wrong"))
  public booleanTypeAndNonBooleanValueReturnsTrue(value: any) {
    const matcher = new TypeMatcher(Boolean);
    Expect(matcher.test(value)).toBe(false);
  }

  @TestCase(new Number(0))
  @TestCase(new Number(1))
  @TestCase(new Number(42))
  @TestCase(new Number(-42))
  @TestCase(new String("test"))
  @TestCase(new String(""))
  @TestCase(new Boolean(true))
  @TestCase(new Boolean(false))
  @TestCase(new Object({}))
  @TestCase(new Object({ an: "object" }))
  @TestCase(new Array([]))
  @TestCase(new Array(["an", "array"]))
  @TestCase(new Error())
  @TestCase(new Error("something went wrong"))
  public objectTypeAndObjectValueReturnsTrue(value: object) {
    const matcher = new TypeMatcher(Object);
    Expect(matcher.test(value)).toBe(true);
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase(-42)
  @TestCase("")
  @TestCase("test")
  @TestCase(true)
  @TestCase(false)
  public objectTypeAndNonObjectValueReturnsTrue(value: any) {
    const matcher = new TypeMatcher(Object);
    Expect(matcher.test(value)).toBe(false);
  }

  @TestCase(new Array([]))
  @TestCase(new Array(["an", "array"]))
  public arrayTypeAndArrayValueReturnsTrue(value: Array<any>) {
    const matcher = new TypeMatcher(Array);
    Expect(matcher.test(value)).toBe(true);
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase(-42)
  @TestCase(new Number(0))
  @TestCase(new Number(1))
  @TestCase(new Number(42))
  @TestCase(new Number(-42))
  @TestCase("")
  @TestCase("test")
  @TestCase(new String("test"))
  @TestCase(new String(""))
  @TestCase(true)
  @TestCase(false)
  @TestCase(new Boolean(true))
  @TestCase(new Boolean(false))
  @TestCase(new Object({}))
  @TestCase(new Object({ an: "object" }))
  @TestCase(new Error())
  @TestCase(new Error("something went wrong"))
  public arrayTypeAndNonArrayValueReturnsTrue(value: any) {
    const matcher = new TypeMatcher(Array);
    Expect(matcher.test(value)).toBe(false);
  }

  @TestCase(new Error())
  @TestCase(new Error("something went wrong"))
  public errorTypeAndArrayValueReturnsTrue(value: Error) {
    const matcher = new TypeMatcher(Error);
    Expect(matcher.test(value)).toBe(true);
  }

  @TestCase(undefined)
  @TestCase(null)
  @TestCase(0)
  @TestCase(1)
  @TestCase(42)
  @TestCase(-42)
  @TestCase(new Number(0))
  @TestCase(new Number(1))
  @TestCase(new Number(42))
  @TestCase(new Number(-42))
  @TestCase("")
  @TestCase("test")
  @TestCase(new String("test"))
  @TestCase(new String(""))
  @TestCase(true)
  @TestCase(false)
  @TestCase(new Boolean(true))
  @TestCase(new Boolean(false))
  @TestCase(new Object({}))
  @TestCase(new Object({ an: "object" }))
  @TestCase(new Array([]))
  @TestCase(new Array(["an", "array"]))
  public errorTypeAndNonErrorValueReturnsTrue(value: any) {
    const matcher = new TypeMatcher(Error);
    Expect(matcher.test(value)).toBe(false);
  }

  @Test()
  public thatMatchesWithValidArgumentsDoesNotThrow() {
    const sut = new TypeMatcher(Error);
    Expect(() => sut.thatMatches("a", null)).not.toThrow();
    Expect(() => sut.thatMatches({})).not.toThrow();
    Expect(() => sut.thatMatches((v: Error) => true)).not.toThrow();
  }

  @Test()
  public thatMatchesWithInvalidArgumentsDoesThrow() {
    const sut = new TypeMatcher(Error);

    Expect(() => sut.thatMatches(null as object)).toThrowError(
      TypeError,
      "thatMatches requires none-null or non-undefined argument"
    );
    Expect(() => sut.thatMatches(null as ((v: Error) => boolean))).toThrowError(
      TypeError,
      "thatMatches requires none-null or non-undefined argument"
    );
    Expect(() => sut.thatMatches(3 as any)).toThrowError(
      Error,
      "Invalid arguments"
    );
  }

  @TestCase(new Error("This is my error"), "message", "This is my error", true)
  @TestCase(
    new Error("This is not my error"),
    "message",
    "This is my error",
    false
  )
  @TestCase(
    new Error("This is not my error"),
    "someNonExistantProperty",
    "This property doesn't exist",
    false
  )
  @TestCase(new DerivedError(32, "This is my error"), "state", 32, true)
  @TestCase(new DerivedError(32, "This is my error"), "state", "32", false)
  @TestCase(new DerivedError(32, "This is my error"), "state", 24, false)
  @TestCase("This is a string", "length", 16, true)
  @TestCase([2], "length", 1, true)
  public thatMatchesWithKeyAndValueReturnsExpected<ItemType extends object>(
    item: ItemType,
    key: string,
    value: any,
    output: boolean
  ) {
    /* tslint:disable-line:max-line-length */
    const sut = new TypeMatcher(item.constructor as new (
      ...args: Array<any>
    ) => ItemType).thatMatches(key, value);

    Expect(sut.test(item)).toBe(output);
  }

  @TestCase(
    new Error("This is my error"),
    { message: "This is my error" },
    true
  )
  @TestCase(
    new Error("This is not my error"),
    { message: "This is my error" },
    false
  )
  @TestCase(
    new Error("This is not my error"),
    { someNonExistantProperty: "This property doesn't exist" },
    false
  )
  @TestCase(new DerivedError(32, "This is my error"), { state: 32 }, true)
  @TestCase(
    new DerivedError(32, "This is my error"),
    { state: 32, message: "This is my error" },
    true
  )
  @TestCase(new DerivedError(32, "This is my error"), { state: "32" }, false)
  @TestCase(
    new DerivedError(32, "This is my error"),
    { state: 24, message: "This is my error" },
    false
  )
  @TestCase("This is a string", { length: 16 }, true)
  @TestCase([2], { length: 1 }, true)
  public thatMatchesWithObjectLiteralReturnsExpected<ItemType extends object>(
    item: ItemType,
    properties: object,
    output: boolean
  ) {
    /* tslint:disable-line:max-line-length */
    const sut = new TypeMatcher(item.constructor as new (
      ...args: Array<any>
    ) => ItemType).thatMatches(properties);

    Expect(sut.test(item)).toBe(output);
  }

  @TestCase(
    new Error("This is my error"),
    (e: Error) => e.message === "This is my error",
    true
  )
  @TestCase(
    new Error("This is not my error"),
    (e: Error) => e.message === "This is my error",
    false
  )
  @TestCase(
    new DerivedError(32, "This is my error"),
    (e: DerivedError) => e.state === 32,
    true
  )
  @TestCase(
    new DerivedError(32, "This is my error"),
    (e: DerivedError) => e.message === "This is my error",
    true
  )
  @TestCase(
    new DerivedError(32, "This is not my error"),
    (e: DerivedError) => e.message === "This is my error",
    false
  )
  @TestCase("This is a string", (e: string) => e.length === 16, true)
  @TestCase([2], (e: Array<number>) => e.length === 1, true)
  public thatMatchesWithDelegateReturnsExpected<ItemType extends object>(
    item: ItemType,
    delegate: (v: ItemType) => boolean,
    output: boolean
  ) {
    /* tslint:disable-line:max-line-length */
    const sut = new TypeMatcher(item.constructor as new (
      ...args: Array<any>
    ) => ItemType).thatMatches(delegate);

    Expect(sut.test(item)).toBe(output);
  }

  @Test()
  public thatMatchesWithKeyAndValueStringifiesAsExpected() {
    const sut = new TypeMatcher(Error).thatMatches(
      "message",
      "This is my error"
    );
    Expect(sut.stringify()).toBe(
      "Any Error and with property 'message' equal to '\"This is my error\"'"
    );
  }

  @Test()
  public thatMatchesWithObjectLiteralStringifiesAsExpected() {
    const literal = { message: "This is my error", someFunc: (v: any) => true };
    const sut = new TypeMatcher(Error).thatMatches(literal);
    Expect(sut.stringify()).toBe(
      `Any Error and matches '${JSON.stringify(literal, replacer)}'`
    );
  }

  @TestCase(new Testable("a", "b"), new Testable("a", "b"))
  @Test()
  public thatMatchesShouldMatchAClassInstance(
    instance: Testable<any, any>,
    matcher: Testable<any, any>
  ) {
    const sut = new TypeMatcher(Testable).thatMatches(matcher);
    Expect(sut.test(instance)).toBe(true);
  }

  @Test()
  public thatMatchesWithDelegateStringifiesAsExpected() {
    const matcher = (e: Error) => e.message === "This is my error";
    const sut = new TypeMatcher(Error).thatMatches(matcher);
    Expect(sut.stringify()).toBe(
      `Any Error and matches '${matcher.toString()}'`
    );
  }

  @Test()
  public thatMatchesWithChainStringifiesAsExpected() {
    const literal = { message: "This is my error" };
    const matcher = (e: Error) => e.message === "This is my error";
    const sut = new TypeMatcher(Error)
      .thatMatches("message", "This is my error")
      .thatMatches(literal)
      .thatMatches(matcher);

    Expect(sut.stringify()).toBe(
      `Any Error and with property 'message' equal to '\"This is my error\"' and matches '${JSON.stringify(
        literal,
        replacer
      )}' and matches '${matcher.toString()}'`
    ); /* tslint:disable-line:max-line-length */
  }
}

const replacer = (key: string, value: any) => {
  if (typeof value === "function") {
    return value.toString();
  }

  return value;
};
