import { FileRequirer } from "../../../core/file-requirer";
import { Expect, Test, TestFixture, TestCase } from "../../../core/alsatian-core";
import * as mock from "mock-require";

@TestFixture("file requirer")
export class FileRequirerTests {

	@TestCase("path")
	@TestCase("another/path")
	@Test("require calls require")
	public requireCallsRequire(path: string) {
		const module = {};

		mock(path, module);

		Expect(new FileRequirer().require(path)).toBe(module);
	}
}
