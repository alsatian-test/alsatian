import { Expect, Test, TestFixture, TestCase } from "alsatian";
import { Numbers } from "./numbers";

@TestFixture("numbers generator tests")
export class NumbersGeneratorTests {
    @TestCase(5, -1, 1)
    @TestCase(3, 2, 1)
    @Test("upper limit below lower limit throws error")
    public upperLimitBelowLowerLimit(lowerLimit: number, upperLimit: number, step: number) {
        Expect(() => Numbers.Between(lowerLimit, upperLimit, step)).toThrowError(TypeError, "upper limit must be greater than lower limit");
    }

    @TestCase(-42, 1)
    @TestCase(0, 1)
    @TestCase(13, 1)
    @Test("upper limit equal to lower limit throws error")
    public upperLimitEqualLowerLimit(limit: number, step: number) {
        Expect(() => Numbers.Between(limit, limit, step)).toThrowError(TypeError, "upper limit must be greater than lower limit");
    }

    @TestCase(-42, 1)
    @TestCase(0, 1)
    @TestCase(13, 1)
    @Test("first number generated is lower limit")
    public firstNumberGenerated(lowerLimit: number, step: number) {
        const numberGenerator = Numbers.Between(lowerLimit, 100, step)();

        Expect(numberGenerator.next().value).toBe(lowerLimit);
    }

    @TestCase(-42, 5, -45)
    @TestCase(0, 2, 0)
    @TestCase(13, 100, 0)
    @Test("last number generated does not exceed the upper limit")
    public lastNumberGenerated(upperLimit: number, step: number, expected: number) {
        const numberGenerator = Numbers.Between(-100, upperLimit, step)();

        let lastValue = numberGenerator.next();
        let currentValue = lastValue;

        while(currentValue.done === false) {
            lastValue = currentValue;
            currentValue = numberGenerator.next();
        };

        Expect(lastValue.value as number).toBe(expected);
    }

    @TestCase(-1, 5, 1, 7)
    @TestCase(2, 3, 0.5, 3)
    @TestCase(0, 10, 0.2, 51)
    @Test("number of numbers created is inclusive of limits")
    public numberOfNumbersGenerated(lowerLimit: number, upperLimit: number, step: number, expected: number) {
        const intGenerator = Numbers.Between(lowerLimit, upperLimit, step)();

        let integersGenerated = 0;

        for (; intGenerator.next().done === false; integersGenerated++);

        Expect(integersGenerated).toBe(expected);
    }

    @TestCase(-1, 5, 0)
    @TestCase(1, 2, 0)
    @Test("throws is step equal to zero")
    public stepEqualsToZeroThrows(lowerLimit: number, upperLimit: number, step: number) {
        Expect(() => Numbers.Between(lowerLimit, upperLimit, step)).toThrowError(TypeError, "step cannot be equal to zero");
    }

    @Test("returns only falsy values")
    public returnsOnlyFalsyValues() {
        const generator = Numbers.Falsy();

        Expect(generator.next().value).toBe(0);
        Expect(generator.next().value).toBe(-0);
        Expect(isNaN(generator.next().value as number)).toBe(true);
        Expect(generator.next().value).toBe(null);
        Expect(generator.next().value).toBe(undefined);

        Expect(generator.next().done).toBe(true);
    }

    @Test("returns only edge cases")
    public returnsOnlyEdgeCases() {
        const generator = Numbers.EdgeCases();

        Expect(isNaN(generator.next().value as number)).toBe(true);
        Expect(isFinite(generator.next().value as number)).toBe(false);
        Expect(isFinite(generator.next().value as number)).toBe(false);

        Expect(generator.next().done).toBe(true);
    }
}