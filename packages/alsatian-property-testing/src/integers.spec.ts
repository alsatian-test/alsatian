import { Expect, Test, TestCase, TestFixture } from "alsatian";
import { Integers } from "./integers";

@TestFixture("integer generator tests")
export class IntegerGeneratorTests {

    @TestCase(5, -1)
    @TestCase(3, 2)
    @Test("upper limit below lower limit throws error")
    public upperLimitBelowLowerLimit(lowerLimit: number, upperLimit: number) {
        Expect(() => Integers.between(lowerLimit, upperLimit)).toThrowError(TypeError, "upper limit must be greater than lower limit");
    }

    @TestCase(-42)
    @TestCase(0)
    @TestCase(13)
    @Test("upper limit equal to lower limit throws error")
    public upperLimitEqualLowerLimit(limit: number) {
        Expect(() => Integers.between(limit, limit)).toThrowError(TypeError, "upper limit must be greater than lower limit");
    }

    @TestCase(-42)
    @TestCase(0)
    @TestCase(13)
    @Test("first number generated is lower limit")
    public firstNumberGenerated(lowerLimit: number) {
        const intGenerator = Integers.between(lowerLimit, 100)();

        Expect(intGenerator.next().value).toBe(lowerLimit);
    }

    @TestCase(-42)
    @TestCase(0)
    @TestCase(13)
    @Test("last number generated is upper limit")
    public lastNumberGenerated(upperLimit: number) {
        const intGenerator = Integers.between(-100, upperLimit)();

        let lastValue = intGenerator.next();
        let currentValue = lastValue;

        while(currentValue.done === false) {
            lastValue = currentValue;
            currentValue = intGenerator.next();
        };

        Expect(lastValue.value).toBe(upperLimit);
    }

    @TestCase(-1, 5)
    @TestCase(2, 3)
    @Test("number of integers created is inclusive of limits")
    public numberOfIntegersGenerated(lowerLimit: number, upperLimit: number) {
        const intGenerator = Integers.between(lowerLimit, upperLimit)();

        let integersGenerated = 0;

        for (; intGenerator.next().done === false; integersGenerated++);

        Expect(integersGenerated).toBe(upperLimit - lowerLimit + 1);
    }

    @TestCase(5, -1)
    @TestCase(3, 2)
    @Test("random upper limit below lower limit throws error")
    public randomUpperLimitBelowLowerLimit(lowerLimit: number, upperLimit: number) {
        Expect(() => 
            Integers.random({ between: { lowerLimit, upperLimit } })
                .generate(1)
        ).toThrowError(TypeError, "upper limit must be greater than lower limit");
    }

    @TestCase(-42)
    @TestCase(0)
    @TestCase(13)
    @Test("random upper limit equal to lower limit throws error")
    public randomUpperLimitEqualLowerLimit(limit: number) {
        Expect(() => 
            Integers.random({ between: { lowerLimit: limit, upperLimit: limit } })
                .generate(1)
        ).toThrowError(TypeError, "upper limit must be greater than lower limit");
    }

    @TestCase(-42)
    @TestCase(-1)
    @TestCase(0)
    @TestCase(0.9)
    @Test("requesting less than 1 throws error")
    public requestingLessThanOneThrows(numberRequested: number) {
        Expect(() => 
            Integers.random().generate(numberRequested)
        ).toThrowError(TypeError, "must generate at least one");
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(42)
    @Test("number of integers created is as requested")
    public randomNumberOfIntegersGenerated(numberRequested: number) {
        const intGenerator = Integers.random().generate(numberRequested)();

        let integersGenerated = 0;

        for (; intGenerator.next().done === false; integersGenerated++) {
        };

        Expect(integersGenerated).toBe(numberRequested);
    }
}
