import * as Alsatian from "../../core/alsatian-core";
import { Expect, Test } from "../../core/alsatian-core";

export class AlsatianCoreTests {
	@Test()
	public expectShouldBeExposed() {
		Expect(Alsatian.Expect).toBeDefined();
		Expect(Alsatian.Expect).not.toBeNull();
	}

	@Test()
	public testShouldBeExposed() {
		Expect(Alsatian.Test).toBeDefined();
		Expect(Alsatian.Test).not.toBeNull();
	}

	@Test()
	public testCaseShouldBeExposed() {
		Expect(Alsatian.TestCase).toBeDefined();
		Expect(Alsatian.TestCase).not.toBeNull();
	}

	@Test()
	public testRunnerShouldBeExposed() {
		Expect(Alsatian.TestRunner).toBeDefined();
		Expect(Alsatian.TestRunner).not.toBeNull();
	}

	@Test()
	public spyOnShouldBeExposed() {
		Expect(Alsatian.SpyOn).toBeDefined();
		Expect(Alsatian.SpyOn).not.toBeNull();
	}

	@Test()
	public setupShouldBeExposed() {
		Expect(Alsatian.Setup).toBeDefined();
		Expect(Alsatian.Setup).not.toBeNull();
	}

	@Test()
	public teardownShouldBeExposed() {
		Expect(Alsatian.Teardown).toBeDefined();
		Expect(Alsatian.Teardown).not.toBeNull();
	}

	@Test("Any should be exposed")
	public anyShouldBeExposed() {
		Expect(Alsatian.Any).toBeDefined();
		Expect(Alsatian.Any).not.toBeNull();
	}

	@Test("RestorableFunctionSpy should be exposed")
	public restorableFunctionSpyShouldBeExposed() {
		Expect(Alsatian.RestorableFunctionSpy).toBeDefined();
		Expect(Alsatian.RestorableFunctionSpy).not.toBeNull();
	}

	@Test("createFunctionSpy should be exposed")
	public createFunctionSpyShouldBeExposed() {
		Expect(Alsatian.createFunctionSpy).toBeDefined();
		Expect(Alsatian.createFunctionSpy).not.toBeNull();
	}

	@Test("log should be exposed")
	public logShouldBeExposed() {
		Expect(Alsatian.log).toBeDefined();
		Expect(Alsatian.log).not.toBeNull();
	}
}
