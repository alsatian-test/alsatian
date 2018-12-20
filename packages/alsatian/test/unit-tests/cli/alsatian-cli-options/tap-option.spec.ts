import { AlsatianCliOptions } from "../../../../cli/alsatian-cli-options";
import { DuplicateCliArgumentError } from "../../../../cli/errors/duplicate-cli-argument-error";
import { Expect, Test, TestCase } from "../../../../core/alsatian-core";

export class TapOptionTests {
	@Test()
	public tapDefaultsToFalse() {
		const options = new AlsatianCliOptions([]);

		Expect(options.tap).toBe(false);
	}

	@TestCase("--tap")
	@TestCase("-T")
	public tapTrueIfCalled(argument: string) {
		const options = new AlsatianCliOptions([argument]);

		Expect(options.tap).toBe(true);
	}

	@TestCase("--tap", "-T")
	@TestCase("--tap", "--tap")
	@TestCase("-T", "-T")
	public duplicateTapArgumentsThrowsError(
		firstArgument: string,
		secondArgument: string
	) {
		Expect(() => {
			const options = new AlsatianCliOptions([
				firstArgument,
				secondArgument
			]);
		}).toThrowError(
			DuplicateCliArgumentError,
			'Duplicate "tap" arguments were provided.'
		);
	}

	@TestCase("--tap", "/test/location.spec.js")
	@TestCase("/another/set/of/**/*.spec.js", "-T")
	public tapVeforeOrAfterGlobIsTrue(
		firstArgument: string,
		secondArgument: string
	) {
		const options = new AlsatianCliOptions([firstArgument, secondArgument]);

		Expect(options.tap).toBe(true);
	}
}
