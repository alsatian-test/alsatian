import { DuplicateCliArgumentError } from "./errors/duplicate-cli-argument-error";
import { InvalidArgumentNamesError } from "./errors/invalid-argument-names-error";
import { InvalidTimeoutValueError } from "./errors/invalid-timeout-value-error";
import { MissingArgumentValueError } from "./errors/missing-argument-value-error";
import { Unused } from "../core/unused";
import { removeItemByIndex } from "../core/utils/remove-item-by-index";

export class AlsatianCliOptions {
	public readonly fileGlobs: Array<string>;
	public readonly timeout: number | null = null;
	public readonly tap: boolean = false;
	public readonly versionRequested: boolean = false;
	public readonly helpRequested: boolean = false;
	public readonly hideProgress: boolean = false;

	public constructor(args: Array<string>) {
		const a = this.extractTap(args);
		this.tap = a.value;

		const b = this.extractVersionRequested(a.args);
		this.versionRequested = b.value;

		const c = this.extractHelpRequested(b.args);
		this.helpRequested = c.value;

		const d = this.extractFileGlobs(c.args);
		this.fileGlobs = d.value;

		const e = this.extractTimeout(d.args);
		this.timeout = e.value;

		const f = this.extractHideProgress(e.args);
		this.hideProgress = f.value;

		if (f.args.length > 0) {
			throw new InvalidArgumentNamesError(f.args);
		}
	}

	private extractFileGlobs(args: Array<string>) {
		const fileGlobs = args.filter((value, index) => {
			const previousArgument = args[index - 1];

			if (
				(!previousArgument || previousArgument[0]) !== "-" &&
				value[0] !== "-"
			) {
				return true;
			}

			return false;
		});

		args = args.filter(value => fileGlobs.indexOf(value) === -1);
		return {
			value: fileGlobs,
			args
		};
	}

	private isInvalidTimeoutValue(timeoutValue: string) {
		const timeout = parseInt(timeoutValue, 10);

		return (
			isNaN(timeout) || timeout < 1 || timeout.toString() !== timeoutValue
		);
	}

	private extractTimeout(args: Array<string>) {
		const timeoutValue = this.getArgumentValueFromArgumentList(
			args,
			"timeout",
			"t"
		);

		if (timeoutValue !== null) {
			if (this.isInvalidTimeoutValue(timeoutValue)) {
				throw new InvalidTimeoutValueError(timeoutValue);
			}

			const argumentIndex = this.getArgumentIndexFromArgumentList(
				args,
				"timeout",
				"t"
			);

			// filter out the timeout argument and its value
			args = args.filter((value, index) => {
				Unused(value);
				return index !== argumentIndex && index !== argumentIndex + 1;
			});
		}

		return {
			value: parseInt(timeoutValue, 10) || null,
			args
		};
	}

	private extractTap(args: Array<string>) {
		const argumentIndex = this.getArgumentIndexFromArgumentList(
			args,
			"tap",
			"T"
		);

		// filter out the tap argument and return the other args
		args = args.filter((value, index) => {
			Unused(value);
			return index !== argumentIndex;
		});

		// if we found the tap argument, we want to enable tap output
		return {
			value: argumentIndex !== -1,
			args
		};
	}

	private extractHideProgress(args: Array<string>) {
		const argumentIndex = this.getArgumentIndexFromArgumentList(
			args,
			"hide-progress",
			"H"
		);

		// filter out the tap argument and return the other args
		args = args.filter((value, index) => {
			Unused(value);
			return index !== argumentIndex;
		});

		// if we found the tap argument, we want to enable tap output
		return {
			value: argumentIndex !== -1,
			args
		};
	}

	private extractVersionRequested(args: Array<string>) {
		const argumentIndex = this.getArgumentIndexFromArgumentList(
			args,
			"version",
			"v"
		);

		// filter out the tap argument and return the other args
		args = args.filter((value, index) => {
			Unused(value);
			return index !== argumentIndex;
		});

		// if we found the tap argument, we want to enable tap output
		return {
			value: argumentIndex !== -1,
			args
		};
	}

	private extractHelpRequested(args: Array<string>) {
		const argumentIndex = this.getArgumentIndexFromArgumentList(
			args,
			"help",
			"h"
		);

		// filter out the tap argument and return the other args
		args = args.filter((value, index) => {
			Unused(value);
			return index !== argumentIndex;
		});

		// if we found the tap argument, we want to enable tap output
		return {
			value: argumentIndex !== -1,
			args
		};
	}

	private getArgumentIndexFromArgumentList(
		args: Array<string>,
		argumentName: string,
		argumentShorthand?: string
	): number {
		const matchingArguments = args.filter(
			value =>
				value === "--" + argumentName ||
				value === "-" + argumentShorthand
		);

		if (matchingArguments.length === 0) {
			return -1;
		} else if (matchingArguments.length > 1) {
			throw new DuplicateCliArgumentError(argumentName);
		}

		return args.indexOf(matchingArguments[0]);
	}

	private getArgumentValueFromArgumentList(
		args: Array<string>,
		argumentName: string,
		argumentShorthand?: string
	): string | null {
		const argumentIndex = this.getArgumentIndexFromArgumentList(
			args,
			argumentName,
			argumentShorthand
		);

		if (argumentIndex === -1) {
			return null;
		}

		const valueArgument = args[argumentIndex + 1];

		if (
			valueArgument &&
			(valueArgument[0] !== "-" || !isNaN(parseInt(valueArgument, 10)))
		) {
			return valueArgument;
		} else {
			throw new MissingArgumentValueError(argumentName);
		}
	}
}
