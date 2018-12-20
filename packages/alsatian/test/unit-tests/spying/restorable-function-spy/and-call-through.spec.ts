import { Expect, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { RestorableFunctionSpy } from "../../../../core/spying/restorable-function-spy";

export class AndCallThroughTests {
	@Test()
	public originalFunctionNotCalledIfSpyStub() {
		const object = {
			originalFunction: () => {}
		};

		SpyOn(object, "originalFunction");

		const originalFunction = object.originalFunction;

		const spy = new RestorableFunctionSpy(object, "originalFunction");

		spy.andStub();

		spy.call([]);

		Expect(originalFunction).not.toHaveBeenCalled();
	}

	@Test()
	public originalFunctionCalledIfSpyStubbedThenRestored() {
		const object = {
			originalFunction: () => {}
		};

		SpyOn(object, "originalFunction");

		const originalFunction = object.originalFunction;

		const spy = new RestorableFunctionSpy(object, "originalFunction");

		spy.andStub();
		spy.andCallThrough();

		spy.call([]);

		Expect(originalFunction).toHaveBeenCalled();
	}
}
