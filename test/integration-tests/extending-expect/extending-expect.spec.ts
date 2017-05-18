import { Expect, MixedMatcher, Test } from "../../../core/alsatian-core";

class MatcherExtension extends MixedMatcher {
    public isSomething() {
        return this.actualValue === "something";
    }
}

const extendedExpect = (value: any) => new MatcherExtension(value);

export class ExtendingExpectTests {

    @Test("extension is a mixed matcher")
    public extensionIsMixedMatcher() {
        Expect(extendedExpect(42) instanceof MixedMatcher).toBe(true);
    }

    @Test("extension has new function")
    public extensionHasNewFunctions() {
        Expect(extendedExpect(42).isSomething).toBeDefined();
        Expect(extendedExpect(42).isSomething).not.toBeNull();
        Expect(typeof extendedExpect(42).isSomething).toBe("function");
    }

    @Test("extension retains existing functions")
    public extensionRetainsExistingFunctions() {
        Expect(extendedExpect(42).toBe).toBeDefined();
        Expect(extendedExpect(42).toBe).not.toBeNull();
        Expect(typeof extendedExpect(42).toBe).toBe("function");

        Expect(extendedExpect(42).not.toEqual).toBeDefined();
        Expect(extendedExpect(42).not.toEqual).not.toBeNull();
        Expect(typeof extendedExpect(42).not.toEqual).toBe("function");
    }
}
