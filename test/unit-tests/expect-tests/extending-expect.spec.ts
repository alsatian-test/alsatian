import { Expect,
         Matcher,
         Test,
         TestCase,
         TestFixture } from "../../../core/alsatian-core";

class ExtendedExpect<T> extends Matcher<T> {
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
