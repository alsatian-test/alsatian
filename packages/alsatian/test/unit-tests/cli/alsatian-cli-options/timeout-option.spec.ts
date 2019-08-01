import { AlsatianCliOptions } from "../../../../cli/alsatian-cli-options";
import { DuplicateCliArgumentError } from "../../../../cli/errors/duplicate-cli-argument-error";
import { InvalidTimeoutValueError } from "../../../../cli/errors/invalid-timeout-value-error";
import { MissingArgumentValueError } from "../../../../cli/errors/missing-argument-value-error";
import { Expect, Test, TestCase } from "../../../../core/alsatian-core";

export class TimeoutOptionTests {
	@Test()
	public timeoutDefaultsToNull() {
		const options = new AlsatianCliOptions([]);

		Expect(options.timeout).toBeNull();
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public timeoutSetIfValid(timeout: number) {
		const options = new AlsatianCliOptions([
			"--timeout",
			timeout.toString()
		]);

		Expect(options.timeout).toBe(timeout);
	}

	@TestCase(1)
	@TestCase(2)
	@TestCase(42)
	public timeoutSetIfValidWithShorthand(timeout: number) {
		const options = new AlsatianCliOptions(["-t", timeout.toString()]);

		Expect(options.timeout).toBe(timeout);
	}

	@TestCase("0")
	@TestCase("-1")
	@TestCase("-42")
	@TestCase("abc")
	@TestCase("42xyz")
	public errorThrownIfTimeoutValueIsInvalid(invalidTimeout: string) {
		Expect(
			() => new AlsatianCliOptions(["--timeout", invalidTimeout])
		).toThrowError(
			InvalidTimeoutValueError,
			`Invalid timeout value "${invalidTimeout}" given.`
		);
	}

	@TestCase("-t", "--timeout")
	@TestCase("-t", "-t")
	@TestCase("--timeout", "--timeout")
	public duplicateTimeoutArgumentsThrowsError(
		...inputArguments: Array<string>
	) {
		Expect(
			() =>
				new AlsatianCliOptions([
					inputArguments[0],
					"1",
					inputArguments[1],
					"42"
				])
		).toThrowError(
			DuplicateCliArgumentError,
			'Duplicate "timeout" arguments were provided.'
		);
	}

	@TestCase("-t")
	@TestCase("--timeout")
	public missingTimeoutPeriodThrowsError(timeoutArgument: string) {
		Expect(() => new AlsatianCliOptions([timeoutArgument])).toThrowError(
			MissingArgumentValueError,
			'Argument "timeout" requires a value.'
		);
	}
}
