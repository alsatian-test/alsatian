import { Expect, Test, TestCase } from "../../../../core/alsatian-core";
import { PropertySpy } from "../../../../core/spying";

export class PropertySpyTests {
	@Test()
	public spyIsReturned() {
		const object: any = {};

		const originalGetter = () => {};

		Object.defineProperty(object, "property", {
			get: originalGetter,
			configurable: true
		});

		const propertySpy = new PropertySpy(object, "property");

		const returnValue = propertySpy.andReturnValue("value");

		Expect(propertySpy).toBe(returnValue);
	}

	@TestCase(undefined)
	@TestCase(null)
	@TestCase(0)
	@TestCase(1)
	@TestCase(42)
	@TestCase("")
	@TestCase("something")
	@TestCase({})
	@TestCase({ an: "object" })
	@TestCase([])
	@TestCase(["an", "array"])
	public getterReturnsGivenValue(value: any) {
		const object: any = {};

		const originalGetter = () => {};

		Object.defineProperty(object, "property", {
			get: originalGetter,
			configurable: true
		});

		const propertySpy = new PropertySpy(object, "property").andReturnValue(
			value
		);

		Expect(object.property).toBe(value);
	}
}
