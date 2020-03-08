import { Expect, Test, TestFixture } from "alsatian";
import { TrueAndFalse } from "./true-and-false";

@TestFixture("true and false generator tests")
export class TrueAndFalseGeneratorTests {

    @Test("returns only true and false")
    public returnsOnlyTrueAndFalse() {
        const generator = TrueAndFalse();

        Expect(generator.next().value).toBe(true);
        Expect(generator.next().value).toBe(false);
        Expect(generator.next().done).toBe(true);
    }
}