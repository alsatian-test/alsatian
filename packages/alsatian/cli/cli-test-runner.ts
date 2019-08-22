import { TapBark } from "tap-bark";
import { TestOutputStream, TestRunner, TestSet } from "../core/alsatian-core";
import { AlsatianCliOptions } from "./alsatian-cli-options";

export class CliTestRunner {
	public static create(): CliTestRunner {
		const outputStream = new TestOutputStream();
		const testRunner = new TestRunner(outputStream);
		return new CliTestRunner(testRunner);
	}

	public constructor(private _testRunner: TestRunner) {
		if (!_testRunner) {
			throw new TypeError("_testRunner must not be null or undefined.");
		}
	}

	public async run(userArguments: AlsatianCliOptions) {
		const packageJson = await import("../package.json");

		// if version has been requested then output the current version and exit
		if (userArguments.versionRequested) {
			process.stdout.write("alsatian version " + packageJson.version);
			return;
		}

		// if help has been requested then output info about using the CLI and exit
		if (userArguments.helpRequested) {
			process.stdout.write(
				"\n\n" +
					"alsatian version " +
					packageJson.version +
					"\n" +
					"=========================\n" +
					"CLI options\n" +
					"=========================\n" +
					"HELP:    --help / -h                      " +
					"(outputs CLI information)\n" +
					"VERSION: --version / -v                   " +
					"(outputs the version of the CLI)\n" +
					"TAP:     --tap / -T                       " +
					"(runs alsatian with TAP output)\n" +
					"TIMEOUT: --timeout [number] / -t [number] " +
					"(sets the timeout period for tests in milliseconds - default 500)\n" +
					"HIDE PROGRESS: --hide-progress / -H " +
					"(hides progress from console)\n" +
					"\n"
			);
			return;
		}

		// create test set from given file globs
		const testSet = TestSet.create();
		testSet.addTestsFromFiles(userArguments.fileGlobs);

		if (userArguments.tap) {
			// if they want TAP output then just write to stdout directly
			this._testRunner.outputStream.pipe(process.stdout);
		} else {
			// otherwise create the tap bark reporter
			const hideProgress = (process.env.CI || userArguments.hideProgress);
			const bark = TapBark.create(hideProgress === false);

			// pipe the reporter into stdout
			this._testRunner.outputStream
				.pipe(bark.getPipeable())
				.pipe(process.stdout);
		}

		try {
			await this._testRunner.run(testSet, userArguments.timeout);
		} catch (error) {
			this._handleTestSetRunError(error);
		}
	}

	private _handleTestSetRunError(error: Error) {
		process.stderr.write(error.message + "\n");
		process.exit(1);
	}
}
