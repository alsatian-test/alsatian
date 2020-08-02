import * as child from "child_process";
import * as FileSystem from "fs";
import {
	Expect,
	TestCase,
	Test,
	Timeout,
	TestFixture
} from "../../../core/alsatian-core";
import { join } from "path";

@TestFixture("CLI Integration Tests")
export class CliIntegrationTests {
	@TestCase("to-be")
	@TestCase("to-equal")
	@TestCase("to-throw")
	@Test()
	@Timeout(10000)
	public toBeExpectations(expectationTestName: string) {
		const specFile = join(__dirname, `../../../dist/test/integration-tests/test-sets/expectations/${expectationTestName}.spec.js`);

		const result = child.exec(`alsatian ${specFile} --tap`);

		let consoleOutput = "";

		result.stdout.on("data", (data: string) => (consoleOutput += data));
		result.stderr.on("data", (data: string) => (consoleOutput += data));

		const expectedOutput = FileSystem.readFileSync(
			join(__dirname, `../expected-output/expectations/${expectationTestName}.txt`)
		).toString().replace(/{{SPEC_FILE}}/g, specFile).toLocaleLowerCase();

		return new Promise<void>((resolve, reject) => {
			result.on("close", (code: number) => {
				Expect(consoleOutput.toLocaleLowerCase()).toBe(expectedOutput.replace(/\r/g, ""));
				resolve();
			});
		});
	}

	@TestCase("async-test")
	@TestCase("setup")
	@TestCase("teardown*")
	@TestCase("case-arguments")
	@Test()
	@Timeout(5000)
	public syntaxTests(syntaxTestName: string) {
		const specFile = join(__dirname, `../../../dist/test/integration-tests/test-sets/test-syntax/${syntaxTestName}.spec.js`);

		const result = child.exec(`alsatian ${specFile} --tap`);

		let consoleOutput = "";

		result.stdout.on("data", (data: string) => (consoleOutput += data));
		result.stderr.on("data", (data: string) => (consoleOutput += data));

		const expectedOutput = FileSystem.readFileSync(
			join(__dirname, `../expected-output/test-syntax/${syntaxTestName.replace("*", "")}.txt`)
		).toString().replace(/{{SPEC_FILE}}/g, specFile).toLocaleLowerCase();

		return new Promise<void>((resolve, reject) => {
			result.on("close", (code: number) => {
				Expect(consoleOutput.toLocaleLowerCase()).toBe(expectedOutput.replace(/\r/g, ""));
				resolve();
			});
		});
	}

	public shouldWorkWithSpecifiedTsConfig() {
		const result = child.exec(
			`alsatian` +
				`./dist/test/integration-tests/test-sets/expectations/to-be.spec.js` +
				` --tap` +
				` --project ./dist/test/tsconfig.json`
		);

		let consoleOutput = "";

		result.stdout.on("data", (data: string) => (consoleOutput += data));
		result.stderr.on("data", (data: string) => (consoleOutput += data));

		const expectedOutput = FileSystem.readFileSync(
			`./test/integration-tests/expected-output/` +
				`expectations/to-be.txt`
		).toString();

		return new Promise<void>((resolve, reject) => {
			result.on("close", (code: number) => {
				Expect(consoleOutput).toBe(expectedOutput.replace(/\r/g, ""));
				resolve();
			});
		});
	}
}
