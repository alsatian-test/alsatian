import { Any, Expect, Test, TestCase, TestFixture } from "../../../core/alsatian-core";
import { ArgumentStringifier } from "../../../core/stringification";

@TestFixture("argument stringification")
export class ArgumentStringifierTests {

    @TestCase("string")
    @TestCase("string")
    @TestCase(1)
    @TestCase(42)
    @TestCase(null)
    @Test("normally returns JSONified version of value")
    public jsonifiedNormalValues(value: any) {
        const argumentStringifier = new ArgumentStringifier();

        Expect(argumentStringifier.stringify(value)).toBe(JSON.stringify(value));
    }

    @Test("undefined is stringified")
    public undefinedStringified() {
        const argumentStringifier = new ArgumentStringifier();

        Expect(argumentStringifier.stringify(undefined)).toBe("undefined");
    }

    @Test(`Any returns "Anything"`)
    public anyReturnsAnything() {
        const argumentStringifier = new ArgumentStringifier();

        Expect(argumentStringifier.stringify(Any)).toBe("Anything");
    }

    @TestCase(Object)
    @TestCase(String)
    @TestCase(Number)
    @TestCase(Array)
    @TestCase(Error)
    @Test(`typed Any returns "Any [type name]"`)
    public anyTypeReturnsAnyTypeName(constructor: any) {
        const argumentStringifier = new ArgumentStringifier();

        Expect(argumentStringifier.stringify(Any(constructor))).toBe("Any " + constructor.name);
    }
}
