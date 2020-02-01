import { Expect, Test, TestCase, TestFixture } from "alsatian";
import { product, sum } from "./math";

@TestFixture("math tests")
export class SumTests {

    @TestCase(0, 0, 0)
    @Test("summing two integers")
    public summingTwoIntegers(a: number, b: number, result: number) {
        Expect(sum(a, b)).toBe(result);
    }

    @TestCase(0, 0, 0)
    @Test("product of two integers")
    public productOfTwoIntegers(a: number, b: number, result: number) {
        Expect(product(a, b)).toBe(result);
    }
}
