import { Expect, SpyOn, Test, TestCase } from "../../../../core/alsatian-core";
import { RestorableFunctionSpy } from "../../../../core/spying/restorable-function-spy";

export class RestoreTests {
	@Test()
	public targetsFunctionIsNoLongerASpyWhenCalledFromSpy() {
		const object = {
			originalFunction: () => {}
		};

		const originalFunction = object.originalFunction;

		const spy = SpyOn(object, "originalFunction");

		Expect(object.originalFunction).not.toBe(originalFunction);

		spy.restore();

		Expect(object.originalFunction).toBe(originalFunction);
	}

	@Test()
	public targetsFunctionIsNoLongerASpyWhenCalledFromFunction() {
		const object = {
			originalFunction: () => {}
		};

		const originalFunction = object.originalFunction;

		SpyOn(object, "originalFunction");

		Expect(object.originalFunction).not.toBe(originalFunction);

		(object.originalFunction as any).restore();

		Expect(object.originalFunction).toBe(originalFunction);
	}

	@Test()
	public targetsOriginalFunctionIsCalledAfterRestoreIsCalled() {
		const object: any = {};
		object.originalFunction = () => {};
		const originalSpy = SpyOn(object, "originalFunction");

		const secondSpy = SpyOn(object, "originalFunction");

		object.originalFunction.restore();
		object.originalFunction();

		Expect(originalSpy).toHaveBeenCalled();
		Expect(secondSpy).not.toHaveBeenCalled();
	}
}
