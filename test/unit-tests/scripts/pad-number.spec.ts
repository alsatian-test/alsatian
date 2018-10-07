import {
  Expect,
  Test,
  TestCase,
  TestFixture
} from "../../../core/alsatian-core";
import { padNumber } from "../../../scripts/pad-number";

@TestFixture("padding numbers")
export class PadNumberTests {
  @TestCase(1, "0")
  @TestCase(2, "00")
  @TestCase(3, "000")
  @Test("returns correct number of zeros")
  public correctNumberOfZeros(numberOfZeros: number, expectedOutput: string) {
    Expect(padNumber(0, numberOfZeros)).toBe(expectedOutput);
  }

  @TestCase(1, "1")
  @TestCase(2, "01")
  @TestCase(3, "001")
  @Test("single digit integer padded correctly")
  public singleDigitPaddedCorrectly(
    numberOfZeros: number,
    expectedOutput: string
  ) {
    Expect(padNumber(1, numberOfZeros)).toBe(expectedOutput);
  }

  @TestCase(1, "42")
  @TestCase(2, "42")
  @TestCase(3, "042")
  @Test("double digit integer padded correctly")
  public doubleDigitPaddedCorrectly(
    numberOfZeros: number,
    expectedOutput: string
  ) {
    Expect(padNumber(42, numberOfZeros)).toBe(expectedOutput);
  }

  @TestCase(1, "-42")
  @TestCase(2, "-42")
  @TestCase(3, "-042")
  @Test("negative integer padded correctly")
  public negativePaddedCorrectly(
    numberOfZeros: number,
    expectedOutput: string
  ) {
    Expect(padNumber(-42, numberOfZeros)).toBe(expectedOutput);
  }

  @TestCase(1, "42.1")
  @TestCase(2, "42.1")
  @TestCase(3, "042.1")
  @Test("single decimal padded correctly")
  public singleDecimalPaddedCorrectly(
    numberOfZeros: number,
    expectedOutput: string
  ) {
    Expect(padNumber(42.1, numberOfZeros)).toBe(expectedOutput);
  }

  @TestCase(1, "42.42")
  @TestCase(2, "42.42")
  @TestCase(3, "042.42")
  @Test("double decimal padded correctly")
  public doubleDecimalPaddedCorrectly(
    numberOfZeros: number,
    expectedOutput: string
  ) {
    Expect(padNumber(42.42, numberOfZeros)).toBe(expectedOutput);
  }

  @TestCase(11, "00000000001")
  @TestCase(12, "000000000001")
  @TestCase(13, "0000000000001")
  @Test("numbers correctly padded that exceed the cached zeros")
  public numbersCorrectlyPaddedOverCache(
    numberOfZeros: number,
    expectedOutput: string
  ) {
    Expect(padNumber(1, numberOfZeros)).toBe(expectedOutput);
  }
}
