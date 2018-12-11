import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	SpyOn,
	Test,
	TestFixture,
	FocusTest
} from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

export class FocussedTestTests {
	@Test()
	public singleUnfocussedTest() {
		const fileRequirer = new FileRequirer();

		@TestFixture()
		class SingleUnfocussedTest {
			@Test()
			public unfocussedTest() {}
		}

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(SingleUnfocussedTest);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test")[0].tests[0].focussed).toBe(
			false
		);
	}

	@Test()
	public singleFocussedTest() {
		const fileRequirer = new FileRequirer();

		@TestFixture()
		class SingleFocussedTest {
			@Test()
			@FocusTest
			public focussedTest() {}
		}

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(SingleFocussedTest);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test")[0].tests[0].focussed).toBe(
			true
		);
	}
}
