import { Expect, Test, TestFixture } from "alsatian";
import { NullAndUndefined } from "./null-and-undefined";

@TestFixture("null and undefined generator tests")
export class NullAndUndefinedGeneratorTests {

    @Test("returns only null and undefined")
    public returnsOnlyNullAndUndefined() {
        const generator = NullAndUndefined();

        Expect(generator.next().value).toBe(null);
        Expect(generator.next().value).toBe(undefined);
        Expect(generator.next().done).toBe(true);
    }
}