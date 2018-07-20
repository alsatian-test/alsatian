import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { EmptyMatchError } from "../../../core/errors/empty-match-error";

class DummyClass {}

export class ToBeEmptyTests {
  private readonly _typeErrorMessage: string =
    "toBeEmpty requires value passed in to Expect to be " +
    "an array, string, object literal or map";

  @TestCase([])
  @TestCase([1])
  @TestCase([1, 2])
  public emptyShouldNotThrowTypeErrorForArrays(value: Array<any>) {
    const expect = Expect(value);

    Expect(() => expect.toBeEmpty()).not.toThrowError(
      TypeError,
      this._typeErrorMessage
    );
  }

  @TestCase("")
  @TestCase("string")
  public emptyShouldNotThrowTypeErrorForStrings(value: string) {
    const expect = Expect(value);

    Expect(() => expect.toBeEmpty()).not.toThrowError(
      TypeError,
      this._typeErrorMessage
    );
  }

  @TestCase({})
  @TestCase({ a: true })
  public emptyShouldNotThrowTypeErrorForObjectLiterals(value: object) {
    const expect = Expect(value);

    Expect(() => expect.toBeEmpty()).not.toThrowError(
      TypeError,
      this._typeErrorMessage
    );
  }

  @TestCase(new Map())
  @TestCase(new Map([["keyOne", "valueOne"]]))
  public emptyShouldNotThrowTypeErrorForMaps(value: Map<any, any>) {
    const expect = Expect(value);

    Expect(() => expect.toBeEmpty()).not.toThrowError(
      TypeError,
      this._typeErrorMessage
    );
  }

  @TestCase(null)
  @TestCase(undefined)
  public emptyShouldThrowTypeErrorForNullTypes(value: any) {
    const EXPECT = Expect("");
    (EXPECT as any)._actualValue = value;

    Expect(() => EXPECT.toBeEmpty()).toThrowError(
      TypeError,
      "toBeEmpty requires value passed in to Expect not to be null or undefined"
    );
  }

  @TestCase(0)
  @TestCase(42)
  @TestCase(-42)
  @TestCase(true)
  @TestCase(new Date())
  @TestCase(new Error())
  @TestCase(new DummyClass())
  public emptyShouldThrowTypeErrorForInvalidTypes(value: any) {
    const EXPECT = Expect("");
    (EXPECT as any)._actualValue = value;

    Expect(() => EXPECT.toBeEmpty()).toThrowError(
      TypeError,
      this._typeErrorMessage
    );
  }

  @Test()
  public emptyShouldNotThrowErrorForEmptyArray() {
    const expect = Expect([]);

    Expect(() => expect.toBeEmpty()).not.toThrow();
  }

  @Test()
  public emptyShouldThrowErrorForNonEmptyArray() {
    const expect = Expect([0]);

    Expect(() => expect.toBeEmpty()).toThrowError(
      EmptyMatchError,
      'Expected "[0]" to be empty.'
    );
  }

  @Test()
  public notEmptyShouldThrowErrorForEmptyArray() {
    const expect = Expect([]);

    Expect(() => expect.not.toBeEmpty()).toThrowError(
      EmptyMatchError,
      'Expected "[]" not to be empty.'
    );
  }

  @Test()
  public notEmptyShouldNotThrowErrorForNonEmptyArray() {
    const expect = Expect([0]);

    Expect(() => expect.not.toBeEmpty()).not.toThrow();
  }

  @Test()
  public emptyShouldNotThrowErrorForEmptyString() {
    const expect = Expect("");

    Expect(() => expect.toBeEmpty()).not.toThrow();
  }

  @Test()
  public emptyShouldThrowErrorForNonEmptyString() {
    const expect = Expect("string");

    Expect(() => expect.toBeEmpty()).toThrowError(
      EmptyMatchError,
      'Expected "string" to be empty.'
    );
  }

  @Test()
  public notEmptyShouldThrowErrorForEmptyString() {
    const expect = Expect("");

    Expect(() => expect.not.toBeEmpty()).toThrowError(
      EmptyMatchError,
      'Expected "" not to be empty.'
    );
  }

  @Test()
  public notEmptyShouldNotThrowErrorForNonEmptyString() {
    const expect = Expect("string");

    Expect(() => expect.not.toBeEmpty()).not.toThrow();
  }

  @Test()
  public emptyShouldNotThrowErrorForEmptyObject() {
    const expect = Expect({});

    Expect(() => expect.toBeEmpty()).not.toThrow();
  }

  @Test()
  public emptyShouldThrowErrorForNonEmptyObject() {
    const expect = Expect({ a: true });

    Expect(() => expect.toBeEmpty()).toThrowError(
      EmptyMatchError,
      'Expected "{"a":true}" to be empty.'
    );
  }

  @Test()
  public notEmptyShouldThrowErrorForEmptyObject() {
    const expect = Expect({});

    Expect(() => expect.not.toBeEmpty()).toThrowError(
      EmptyMatchError,
      'Expected "{}" not to be empty.'
    );
  }

  @Test()
  public notEmptyShouldNotThrowErrorForNonEmptyObject() {
    const expect = Expect({ a: true });

    Expect(() => expect.not.toBeEmpty()).not.toThrow();
  }

  @Test()
  public emptyShouldNotThrowErrorForEmptyMap() {
    const expect = Expect(new Map());

    Expect(() => expect.toBeEmpty()).not.toThrow();
  }

  @Test()
  public emptyShouldThrowErrorForNonEmptyMap() {
    const expect = Expect(new Map([["key", "value"]]));

    Expect(() => expect.toBeEmpty()).toThrowError(
      EmptyMatchError,
      'Expected "Map<1>" to be empty.'
    );
  }

  @Test()
  public notEmptyShouldThrowErrorForEmptyMap() {
    const expect = Expect(new Map());

    Expect(() => expect.not.toBeEmpty()).toThrowError(
      EmptyMatchError,
      'Expected "Map<0>" not to be empty.'
    );
  }

  @Test()
  public notEmptyShouldNotThrowErrorForNonEmptyMap() {
    const expect = Expect(new Map([["key", "value"]]));

    Expect(() => expect.not.toBeEmpty()).not.toThrow();
  }
}
