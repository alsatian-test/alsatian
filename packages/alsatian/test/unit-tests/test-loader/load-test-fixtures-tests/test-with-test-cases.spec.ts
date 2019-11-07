import "reflect-metadata";
import {
	Expect,
	SpyOn,
	Test,
	TestFixture,
	TestCase
} from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";

export class TestDescriptionTests {
	@Test()
	public defaultDescriptionTest() {
		const fileRequirer = new FileRequirer();

		@TestFixture()
		class DefaultDescriptionTest {
			@Test()
			public defaultTest() {}
		}

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(DefaultDescriptionTest);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test")[0].tests[0].description).toBe("defaultTest");
	}

	@TestCase("test")
	@TestCase("test name")
	@TestCase("ANOTHER test")
	@Test()
	public givenDescriptionTest(testName: string) {
		const fileRequirer = new FileRequirer();

		@TestFixture()
		class GivenDescriptionTest {
			@Test(testName)
			public defaultTest() {}
		}

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(GivenDescriptionTest);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test")[0].tests[0].description).toBe(testName);
	}
}
