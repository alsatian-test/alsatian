import { Expect, Matcher, Test } from "../../../core/alsatian-core";

class MatcherExtension extends Matcher {
    isSomething() {
        this.actualValue === "something";
    }
}

const ExtendedExpect = (value: any) => new MatcherExtension(value);

export class ExtendingExpectTests {

    @Test("extension is a matcher")
    public extensionIsMatcher() {
        Expect(ExtendedExpect(42) instanceof Matcher).toBe(true);
    }

    @Test("extension has new function")
    public extensionHasNewFunctions() {
        Expect(ExtendedExpect(42).isSomething).toBeDefined();
        Expect(ExtendedExpect(42).isSomething).not.toBeNull();
        Expect(typeof ExtendedExpect(42).isSomething).toBe("function");
    }

    @Test("extension retains existing functions")
    public extensionRetainsExistingFunctions() {
        Expect(ExtendedExpect(42).toBe).toBeDefined();
        Expect(ExtendedExpect(42).toBe).not.toBeNull();
        Expect(typeof ExtendedExpect(42).toBe).toBe("function");

        Expect(ExtendedExpect(42).not.toEqual).toBeDefined();
        Expect(ExtendedExpect(42).not.toEqual).not.toBeNull();
        Expect(typeof ExtendedExpect(42).not.toEqual).toBe("function");
    }

}