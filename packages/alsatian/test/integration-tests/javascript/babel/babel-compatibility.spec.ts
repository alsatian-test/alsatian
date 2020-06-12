import * as child from "child_process";
import * as FileSystem from "fs";
import { AsyncTest, Expect, Timeout } from "alsatian";
import { join } from "path";

export class BabelIntegrationTests {
	@AsyncTest()
	@Timeout(5000)
	public toBeExpectations() {
		const specFile = join(__dirname, "../../../../dist/test/integration-tests/javascript/test-sets/expectations/to-be.spec.js");

		const result = child.exec(`alsatian ${specFile} --tap`);

		let consoleOutput = "";

		result.stdout.on("data", (data: string) => (consoleOutput += data));
		result.stderr.on("data", (data: string) => (consoleOutput += data));

		const expectedOutput = FileSystem.readFileSync(
			join(__dirname, "../../expected-output/expectations/to-be.txt")
		).toString().replace(/{{SPEC_FILE}}/g, specFile).toLocaleLowerCase();

		return new Promise<void>((resolve, reject) => {
			result.on("close", (code: number) => {
				Expect(consoleOutput.toLocaleLowerCase()).toBe(expectedOutput.replace(/\r/g, ""));
				resolve();
			});
		});
	}

	@AsyncTest()
	@Timeout(10000)
	public toThrowExpectations() {
		const specFile = join(__dirname, "../../../../dist/test/integration-tests/javascript/test-sets/expectations/to-throw.spec.js");

		const result = child.exec(`alsatian ${specFile} --tap`);

		let consoleOutput = "";

		result.stdout.on("data", (data: string) => (consoleOutput += data));
		result.stderr.on("data", (data: string) => (consoleOutput += data));

		const expectedOutput = FileSystem.readFileSync(
			join(__dirname, "../../expected-output/expectations/to-throw.txt")
		).toString().replace(/{{SPEC_FILE}}/g, specFile).toLocaleLowerCase();

		return new Promise<void>((resolve, reject) => {
			result.on("close", (code: number) => {
				Expect(consoleOutput.toLocaleLowerCase()).toBe(expectedOutput.replace(/\r/g, ""));
				resolve();
			});
		});
	}

	@AsyncTest()
	@Timeout(5000)
	public asyncTest() {
		const specPath = join(__dirname, "../../../../dist/test/integration-tests/javascript/test-sets/test-syntax/");

		const result = child.exec(`alsatian ${specPath}**/*.spec.js --tap`);

		let consoleOutput = "";

		result.stdout.on("data", (data: string) => (consoleOutput += data));
		result.stderr.on("data", (data: string) => (consoleOutput += data));

		const expectedOutput = FileSystem.readFileSync(
			join(__dirname, "../../expected-output/test-syntax/all-test-syntax.txt")
		).toString().replace(/{{SPEC_PATH}}/g, specPath.replace(/\\/g, "/")).toLocaleLowerCase();

		return new Promise<void>((resolve, reject) => {
			result.on("close", (code: number) => {
				Expect(consoleOutput.toLocaleLowerCase()).toBe(expectedOutput.replace(/\r/g, ""));
				resolve();
			});
		});
	}
}
