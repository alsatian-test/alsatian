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

export class TestCasesTests {
	@Test()
	public twoTestCasesTest() {
		const fileRequirer = new FileRequirer();

		@TestFixture()
		class TwoTestCasesTest {
			@TestCase(1)
			@TestCase(2)
			@Test()
			public defaultTest() {}
		}

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(TwoTestCasesTest);

  const testLoader = new TestLoader(fileRequirer);

  const loadedTest = testLoader.loadTestFixture("test")[0].tests[0];

  Expect(loadedTest.testCases.length).toBe(2);
  Expect(loadedTest.testCases[0].caseArguments).toEqual([1]);
  Expect(loadedTest.testCases[1].caseArguments).toEqual([2]);
	}

	@Test()
	public threeCasesTest(testName: string) {
		const fileRequirer = new FileRequirer();

		@TestFixture()
		class ThreeTestCasesTest {
			@TestCase("one")
			@TestCase("two")
			@TestCase("three")
			@Test()
			public defaultTest() {}
		}

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(ThreeTestCasesTest);

  const testLoader = new TestLoader(fileRequirer);

  const loadedTest = testLoader.loadTestFixture("test")[0].tests[0];

  Expect(loadedTest.testCases.length).toBe(3);
  Expect(loadedTest.testCases[0].caseArguments).toEqual(["one"]);
  Expect(loadedTest.testCases[1].caseArguments).toEqual(["two"]);
  Expect(loadedTest.testCases[2].caseArguments).toEqual(["three"]);
	}
}
