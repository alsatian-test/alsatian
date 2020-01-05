/*
import * as mock from "mock-require";
import {
	Any,
	createFunctionSpy,
	Expect,
	SpyOn,
	Test,
	TestFixture,
	RestorableFunctionSpy
} from "../../../core/alsatian-core";
import { CliTestRunner } from "../../../cli/cli-test-runner";

@TestFixture("alsatian cli tests")
export class AlsatianCliTests {

	@Test("cli runner called with arguments")
	public cliRunnerCalledWithArguments() {
		class MockOptions {}

		mock("../../../cli/alsatian-cli-options", { AlsatianCliOptions: MockOptions });

		const runnerMock = {
			run: createFunctionSpy()
		};

		SpyOn(CliTestRunner, "create").andReturn(runnerMock);

		require("../../../cli/alsatian-cli");

		Expect(runnerMock.run).toHaveBeenCalledWith(Any(MockOptions));

		(CliTestRunner.create as unknown as RestorableFunctionSpy).restore();
	}
}
*/
