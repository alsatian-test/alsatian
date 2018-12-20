import {
	Any,
	Expect,
	Test,
	TestCase,
	TestFixture
} from "../../../core/alsatian-core";
import { stringify } from "../../../core/stringification";

@TestFixture("stringification")
export class StringifyTests {
	@TestCase("string")
	@TestCase("string")
	@TestCase(1)
	@TestCase(42)
	@TestCase(null)
	@Test("normally returns JSONified version of value")
	public jsonifiedNormalValues(value: any) {
		Expect(stringify(value)).toBe(JSON.stringify(value));
	}

	@Test("undefined is stringified")
	public undefinedStringified() {
		Expect(stringify(undefined)).toBe("undefined");
	}

	@Test(`Any returns "Anything"`)
	public anyReturnsAnything() {
		Expect(stringify(Any)).toBe("Anything");
	}

	@TestCase(Object)
	@TestCase(String)
	@TestCase(Number)
	@TestCase(Array)
	@TestCase(Error)
	@Test(`typed Any returns "Any [type name]"`)
	public anyTypeReturnsAnyTypeName(constructor: any) {
		Expect(stringify(Any(constructor))).toBe("Any " + constructor.name);
	}
}
