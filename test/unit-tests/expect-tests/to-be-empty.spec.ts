import { Expect, Test, TestCase } from "../../../core/alsatian-core";
import { MatchError } from "../../../core/errors/match-error";

class DummyClass {}

export class ToBeEmptyTests {
  @Test()
  public emptyShouldNotThrowErrorForEmptyArray() {
    const expect = Expect([]);

    Expect(() => expect.toBeEmpty()).not.toThrow();
  }

  @Test()
  public emptyShouldThrowErrorForNonEmptyArray() {
    const expect = Expect([0]);

    Expect(() => expect.toBeEmpty()).toThrowError(
      MatchError,
      'Expected "[0]" to be empty.'
    );
  }

  @Test()
  public notEmptyShouldThrowErrorForEmptyArray() {
    const expect = Expect([]);

    Expect(() => expect.not.toBeEmpty()).toThrowError(
      MatchError,
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
      MatchError,
      'Expected "string" to be empty.'
    );
  }

  @Test()
  public notEmptyShouldThrowErrorForEmptyString() {
    const expect = Expect("");

    Expect(() => expect.not.toBeEmpty()).toThrowError(
      MatchError,
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
      MatchError,
      'Expected "{"a":true}" to be empty.'
    );
  }

  @Test()
  public notEmptyShouldThrowErrorForEmptyObject() {
    const expect = Expect({});

    Expect(() => expect.not.toBeEmpty()).toThrowError(
      MatchError,
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
      MatchError,
      'Expected "Map<1>" to be empty.'
    );
  }

  @Test()
  public notEmptyShouldThrowErrorForEmptyMap() {
    const expect = Expect(new Map());

    Expect(() => expect.not.toBeEmpty()).toThrowError(
      MatchError,
      'Expected "Map<0>" not to be empty.'
    );
  }

  @Test()
  public notEmptyShouldNotThrowErrorForNonEmptyMap() {
    const expect = Expect(new Map([["key", "value"]]));

    Expect(() => expect.not.toBeEmpty()).not.toThrow();
  }
}
