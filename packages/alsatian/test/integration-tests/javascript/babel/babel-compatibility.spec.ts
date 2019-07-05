import * as child from "child_process";
import * as FileSystem from "fs";
import * as path from "path";
import { AsyncTest, Expect, Timeout } from "../../../../core/alsatian-core";

export class BabelIntegrationTests {
	@AsyncTest()
	@Timeout(5000)
	public toBeExpectations() {
		const result = child.exec(
			"alsatian ./dist/test/integration-tests/javascript/test-sets/expectations/to-be.spec.js --tap"
		);

		let consoleOutput = "";

		result.stdout.on("data", (data: string) => (consoleOutput += data));
		result.stderr.on("data", (data: string) => (consoleOutput += data));

		const expectedOutput = FileSystem.readFileSync(
			"./test/integration-tests/expected-output/expectations/to-be.txt"
		).toString();

		return new Promise<void>((resolve, reject) => {
			result.on("close", (code: number) => {
				Expect(consoleOutput).toBe(expectedOutput.replace(/\r/g, ""));
				resolve();
			});
		});
	}

	@AsyncTest()
	@Timeout(5000)
	public toThrowExpectations() {
		const result = child.exec(
			"alsatian ./dist/test/integration-tests/javascript/test-sets/expectations/to-throw.spec.js --tap"
		);

		let consoleOutput = "";

		result.stdout.on("data", (data: string) => (consoleOutput += data));
		result.stderr.on("data", (data: string) => (consoleOutput += data));

		const expectedOutput = FileSystem.readFileSync(
			"./test/integration-tests/expected-output/expectations/to-throw.txt"
		).toString();

		return new Promise<void>((resolve, reject) => {
			result.on("close", (code: number) => {
				Expect(consoleOutput).toBe(expectedOutput.replace(/\r/g, ""));
				resolve();
			});
		});
	}

	@AsyncTest()
	@Timeout(5000)
	public asyncTest() {
		const result = child.exec(
			'alsatian "./dist/test/integration-tests/javascript/test-sets/test-syntax/**/*.spec.js" --tap'
		);

		let consoleOutput = "";

		result.stdout.on("data", (data: string) => (consoleOutput += data));
		result.stderr.on("data", (data: string) => (consoleOutput += data));

		const expectedOutput = FileSystem.readFileSync(
			"./test/integration-tests/expected-output/test-syntax/all-test-syntax.txt"
		).toString();

		return new Promise<void>((resolve, reject) => {
			result.on("close", (code: number) => {
				Expect(consoleOutput).toBe(expectedOutput.replace(/\r/g, ""));
				resolve();
			});
		});
	}
}
