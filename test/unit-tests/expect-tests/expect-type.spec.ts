import { Expect, FocusTests, Test, TestCase, TestFixture } from "../../../core/alsatian-core";

@FocusTests
@TestFixture("correct matchers returned for tests")
export class ExpectTypeTests {

    @TestCase({})
    @TestCase(new Error("something strange"))
    @Test("unknown type gets general functionality")
    public anyGetsDefault(actual: any) {
        Expect(Expect(actual).toBe).toBeDefined();
        Expect(Expect(actual).toBeDefined).toBeDefined();
        Expect(Expect(actual).toBeNull).toBeDefined();
        Expect(Expect(actual).toBeTruthy).toBeDefined();
        Expect(Expect(actual).toEqual).toBeDefined();

    }

    @TestCase({})
    @TestCase(new Error("something strange"))
    @Test("unknown type gets no special type functionality")
    public anyDoesNotGetSpecialFunctions(actual: any) {
        Expect((Expect(actual as string).toMatch)).not.toBeDefined();
    }
}
