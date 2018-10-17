import { diff } from "../../../core/matchers/diff";
import { Test, TestCase, TestFixture, Expect } from "../../../core/alsatian-core";
import chalk from "chalk";

@TestFixture("diffing function")
export class DiffingFunctionTests {

    @TestCase("")
    @TestCase("abc")
    @TestCase({ a: "b", c: "d", e: { f: "g" } })
    @Test("no differences")
    public noDifferences(value: any) {
        Expect(diff(value, value)).toBe("no differences");
    }

    @Test("strings without spaces")
    public stringsWithoutSpaces() {
        Expect(diff("abc", "abd")).toBe(
            `ab${chalk.red("c")}${chalk.green("d")}`
        );
    }

    @Test("strings with spaces")
    public stringsWithSpaces() {
        Expect(diff("a missing value", "another value")).toBe(
            `${chalk.red("a")}${chalk.green("another")} ${chalk.red("missing ")}value`
        );
    }

    @Test("object with missing property")
    public objectWithMissingProperty() {

        Expect(diff({ one: "thing" }, {})).toBe(
            "{\n" +
            chalk.red(`-   one: "thing"`) +
            "\n}"
        );
    }

    @Test("object with extra property")
    public objectWithExtraProperty() {

        Expect(diff({}, { one: "thing" })).toBe(
            "{\n" +
            chalk.green(`+   one: "thing"`) +
            "\n}"
        );
    }

    @Test("object with missing and extra property")
    public objectWithMissingAndExtraProperty() {

        Expect(diff({ missing: "property" }, { extra: "property" })).toBe(
            "{\n" +
            chalk.red(`-   missing: "property"`) + ",\n" +
            chalk.green(`+   extra: "property"`) +
            "\n}"
        );
    }

    @Test("object with missing child property")
    public objectWithMissingChildProperty() {

        const objectWithProperty = {
            a: { 
                missing: "property",
                shared: "property"
            }
        };

        const objectWithoutProperty = {
            a: {
                shared: "property"
            }
        };

        Expect(diff(objectWithProperty, objectWithoutProperty)).toBe(
            "{\n" +
            "    a: {\n" +
            chalk.red(`-     missing: "property"`) +
            "\n    }" +
            "\n}"
        );
    }

    @Test("object with extra child property")
    public objectWithExtraChildProperty() {


        const objectWithProperty = {
            an: { 
                extra: "property",
                shared: "property"
            }
        };

        const objectWithoutProperty = {
            an: {
                shared: "property"
            }
        };

        Expect(diff(objectWithoutProperty, objectWithProperty)).toBe(
            "{\n" +
            "    an: {\n" +
            chalk.green(`+     extra: "property"`) +
            "\n    }" +
            "\n}"
        );
    }

    @Test("object with missing child object")
    public objectWithMissingChildObject() {

        Expect(diff({ a: { missing: "object" } }, {})).toBe(
            "{\n" +
            chalk.red(`-   a: {"missing":"object"}`) +
            "\n}"
        );
    }

    @Test("object with extra child object")
    public objectWithExtraChildObject() {

        Expect(diff({}, { an: { extra: "object" } })).toBe(
            "{\n" +
            chalk.green(`+   an: {"extra":"object"}`) +
            "\n}"
        );
    }
}
