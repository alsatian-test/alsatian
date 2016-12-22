import { Expect, TestFixture, Test, TestCase, Matcher } from "../../../core/alsatian-core";

class ExtendedExpect extends Matcher {
    public get exposedActualValue() {
        return this.actualValue;
    }
}

@TestFixture("extending expect")
export class ExtendingExpectTests {

    @TestCase(undefined)
    @TestCase(null)
    @TestCase(0)
    @TestCase(42)
    @TestCase(4.2)
    @TestCase(-4.2)
    @TestCase("")
    @TestCase("something")
    @Test("actual value can be accessed")
    public canReferenceActualValue(expectedActualValue: any) {
        Expect(new ExtendedExpect(expectedActualValue).exposedActualValue).toBe(expectedActualValue);
    }
}
