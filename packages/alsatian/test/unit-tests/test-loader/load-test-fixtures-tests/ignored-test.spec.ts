import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	SpyOn,
	Test,
	TestCase,
	TestFixture,
	IgnoreTest
} from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

export class IgnoredTestTests {
	@Test()
	public singleUnignoredTest() {
		const fileRequirer = new FileRequirer();

		@TestFixture()
		class Fixture {
			@Test()
			public singleUnignoredTest() {}
		}

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(Fixture);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test")[0].tests[0].ignored).toBe(
			false
		);
	}

	@Test()
	public singleIgnoredTest() {
		const fileRequirer = new FileRequirer();

		@TestFixture()
		class Fixture {
			@Test()
			@IgnoreTest()
			public singleIgnoredTest() {}
		}

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(Fixture);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test")[0].tests[0].ignored).toBe(
			true
		);
	}

	@TestCase("some reason")
	@TestCase("another reason")
	@TestCase("last one, promise!")
	public singleIgnoredTestWithReason(reason: string) {
		const fileRequirer = new FileRequirer();

		@TestFixture()
		class Fixture {
			@Test()
			@IgnoreTest(reason)
			public singleIgnoredTest() {}
		}

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(Fixture);

		const testLoader = new TestLoader(fileRequirer);

		Expect(
			testLoader.loadTestFixture("test")[0].tests[0].ignoreReason
		).toBe(reason);
	}
}
