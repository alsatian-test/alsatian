import "reflect-metadata";
import {
	Expect,
	METADATA_KEYS,
	SpyOn,
	Test,
	TestCase,
	TestFixture
} from "../../../../core/alsatian-core";
import { FileRequirer } from "../../../../core/file-requirer";
import { TestLoader } from "../../../../core/test-loader";
import { Warner } from "../../../../core/maintenance/warn";

@TestFixture("Fake Fixture")
class FakeFixture {
	constructor() {
		Reflect.defineMetadata(METADATA_KEYS.TESTS, [], this);
	}
}

@TestFixture("Multiple Exported Fixture Tests")
export class MultipleExportedFixtureTests {
	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public shouldContainCorrectNumberOfTestFixtures(
		expectedTestFixtureCount: number
	) {
		const fileRequirer = new FileRequirer();

		const testFixtureWrapper: { [key: string]: new () => any } = {};
		for (let i = 0; i < expectedTestFixtureCount; i++) {
			testFixtureWrapper["TestFixture" + i] = FakeFixture;
		}

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(testFixtureWrapper);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test").length).toBe(
			expectedTestFixtureCount
		);
	}

	@Test()
	public shouldIgnoreNonFakeFixtureAtStartOfWrapper() {
		const fileRequirer = new FileRequirer();

		const testFixtureWrapper = {
			firstThing: class NotAFixture {},
			secondThing: FakeFixture,
			thirdThing: FakeFixture
		};

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(testFixtureWrapper);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test").length).toBe(2);
	}

	@Test()
	public shouldIgnoreObjectAtStartOfWrapper() {
		const fileRequirer = new FileRequirer();

		const testFixtureWrapper = {
			firstThing: {},
			secondThing: FakeFixture,
			thirdThing: FakeFixture
		};

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(testFixtureWrapper);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test").length).toBe(2);
	}

	@Test()
	public shouldIgnoreNonFakeFixtureInMiddleOfWrapper() {
		const fileRequirer = new FileRequirer();

		const testFixtureWrapper = {
			firstThing: FakeFixture,
			secondThing: class NotAFixture {},
			thirdThing: FakeFixture
		};

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(testFixtureWrapper);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test").length).toBe(2);
	}

	@Test()
	public shouldIgnoreObjectInMiddleOfWrapper() {
		const fileRequirer = new FileRequirer();

		const testFixtureWrapper = {
			firstThing: FakeFixture,
			secondThing: {},
			thirdThing: FakeFixture
		};

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(testFixtureWrapper);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test").length).toBe(2);
	}

	@Test()
	public shouldIgnoreNonFakeFixtureAtEndOfWrapper() {
		const fileRequirer = new FileRequirer();

		const testFixtureWrapper = {
			firstThing: FakeFixture,
			secondThing: FakeFixture,
			thirdThing: class NotAFixture {}
		};

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(testFixtureWrapper);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test").length).toBe(2);
	}

	@Test()
	public shouldIgnoreObjectAtEndOfWrapper() {
		const fileRequirer = new FileRequirer();

		const testFixtureWrapper = {
			firstThing: FakeFixture,
			secondThing: FakeFixture,
			thirdThing: class NotAFixture {}
		};

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(testFixtureWrapper);

		const testLoader = new TestLoader(fileRequirer);

		Expect(testLoader.loadTestFixture("test").length).toBe(2);
	}

	@Test()
	public noTestFixtureAnnotationOutputsWarning() {
		SpyOn(Warner, "warn");

		const fileRequirer = new FileRequirer();

		class UnanotatedFixture {
			@Test()
			public testFunction() {}
		}

		const testFixtureWrapper = {
			firstThing: FakeFixture,
			secondThing: UnanotatedFixture,
			thirdThing: class NotAFixture {}
		};

		const spy = SpyOn(fileRequirer, "require");
		spy.andStub();
		spy.andReturn(testFixtureWrapper);

		const testLoader = new TestLoader(fileRequirer);
		testLoader.loadTestFixture("test");

		Expect(Warner.warn).toHaveBeenCalledWith(
			"Writing tests without the TestFixture decorator has been deprecated and will be removed in version 5.0.0. " +
				"Please add a TestFixture decorator to all classes containing tests."
		);
	}
}
