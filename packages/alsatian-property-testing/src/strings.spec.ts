import { Expect, Test, TestFixture, TestCase } from "alsatian";
import { Strings } from "./strings";

@TestFixture("strings generator tests")
export class StringsGeneratorTests {
    @TestCase(5)
    @TestCase(3)
    @Test()
    public () {
        const stringGenerator = Strings.OfLength({ between: { minLength: lowerLimit } }).generate(10)();



    }
}