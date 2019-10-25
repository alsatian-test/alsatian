import {
	Expect,
	SpyOn,
	TestCase,
	TestOutputStream
} from "../../../core/alsatian-core";

export class EmitFixtureTests {

	@TestCase("log")
	@TestCase("another log")
	@TestCase("OH MY DAYS?!?!")
	public shouldEmitCorrectLog(log: string) {
		const testOutput = new TestOutputStream();
		SpyOn(testOutput, "push");

		testOutput.emitLog(log);

		Expect(testOutput.push).toHaveBeenCalledWith(
			`# LOG: ${log}\n`
		);
	}
}
