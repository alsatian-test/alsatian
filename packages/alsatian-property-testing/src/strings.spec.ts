import { Expect, Test, TestFixture, TestCase } from "alsatian";
import { Strings } from "./strings";
import { GeneratorBuilder } from "./generator-builder";

@TestFixture("strings generator tests")
export class StringsGeneratorTests {
    @Test("returns only falsy values")
    public returnsOnlyFalsyValues() {
        const generator = Strings.Falsy();

        Expect(generator.next().value).toBe("");
        Expect(generator.next().value).toBe(null);        
        Expect(generator.next().value).toBe(undefined);

        Expect(generator.next().done).toBe(true);
    }

    @TestCase(1)
    @TestCase(2)
    @TestCase(50)
    @Test("returns string of given length")
    public returnsStringOfGivenLength(length: number) {
        const generator = Strings.OfLength(length).generate(1)();

        Expect(((generator.next().value) as string).length).toBe(length);
        Expect(generator.next().done).toBe(true);
    }
}