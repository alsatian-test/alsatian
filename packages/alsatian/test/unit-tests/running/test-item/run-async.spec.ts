import {
	Test,
	Expect,
	TestCase,
} from "../../../../core/alsatian-core";
import { MatchError } from "../../../../core/errors";
import { TestItem } from "../../../../core/running/test-item";
import { TestBuilder } from "../../../builders/test-builder";
import { TestFixtureBuilder } from "../../../builders/test-fixture-builder";

export class TestItemRunAsyncTests {
	@Test()
	public async successfulTest() {
		const test = new TestBuilder().withTestCaseCount(1).build();
		test.isAsync = true;

		const testFixture = new TestFixtureBuilder()
			.withFixture({
				testFunction: () =>
					new Promise((resolve, reject) => {
						resolve();
					})
			})
			.addTest(test)
			.build();

		const testItem = new TestItem(testFixture, test, test.testCases[0]);

		let error: Error;

		try {
			await testItem.run(500);
		} catch (e) {
			error = e;
		}

		Expect(error).toBe(undefined);
	}

	@Test()
	public async ignoreTest() {
		const test = new TestBuilder().withTestCaseCount(1).build();
		test.ignored = true;
		test.isAsync = true;

		const testFixture = new TestFixtureBuilder().addTest(test).build();

		const testItem = new TestItem(testFixture, test, test.testCases[0]);

		let error: Error;

		try {
			await testItem.run(500);
		} catch (e) {
			error = e;
		}

		Expect(error).toBe(undefined);
	}

	@Test()
	public async failTest() {
		const test = new TestBuilder().withTestCaseCount(1).build();
		test.isAsync = true;

		const expectedError = new MatchError(
			"something",
			"nothing",
			"expected something to be nothing."
		);

		const testFixture = new TestFixtureBuilder()
			.withFixture({
				testFunction: () =>
					new Promise((resolve, reject) => {
						reject(expectedError);
					})
			})
			.addTest(test)
			.build();

		const testItem = new TestItem(testFixture, test, test.testCases[0]);

		let error: Error;

		try {
			await testItem.run(500);
		} catch (e) {
			error = e;
		}

		Expect(error).toBe(expectedError);
	}

	@Test()
	public async errorTest() {
		const test = new TestBuilder().withTestCaseCount(1).build();
		test.isAsync = true;

		const expectedError = new Error("something awful happened.");

		const testFixture = new TestFixtureBuilder()
			.withFixture({
				testFunction: () =>
					new Promise((resolve, reject) => {
						reject(expectedError);
					})
			})
			.addTest(test)
			.build();

		const testItem = new TestItem(testFixture, test, test.testCases[0]);

		let error: Error;

		try {
			await testItem.run(500);
		} catch (e) {
			error = e;
		}

		Expect(error).toBe(expectedError);
	}

	@Test()
	public async testErrorTest() {
		const test = new TestBuilder().withTestCaseCount(1).build();
		test.isAsync = true;

		const expectedError = new Error("something awful happened.");

		const testFixture = new TestFixtureBuilder()
			.withFixture({
				testFunction: () => {
					throw expectedError;
				}
			})
			.addTest(test)
			.build();

		const testItem = new TestItem(testFixture, test, test.testCases[0]);

		let error: Error;

		try {
			await testItem.run(500);
		} catch (e) {
			error = e;
		}

		Expect(error).toBe(expectedError);
	}

	@TestCase(1)
	@TestCase(42)
	@TestCase(99)
	@Test()
	public async timeoutTest(timeout: number) {
		const test = new TestBuilder().withTestCaseCount(1).build();
		test.isAsync = true;

		const testFixture = new TestFixtureBuilder()
			.withFixture({
				testFunction: () =>
					new Promise((resolve, reject) => {
						setTimeout(resolve, timeout + 100);
					})
			})
			.addTest(test)
			.build();

		const testItem = new TestItem(testFixture, test, test.testCases[0]);

		let error: Error;

		try {
			await testItem.run(timeout);
		} catch (e) {
			error = e;
		}

		Expect(error).toBeDefined();
		Expect(error.message).toBe(
			"The test exceeded the given timeout of " + timeout + "ms."
		);
	}
}
