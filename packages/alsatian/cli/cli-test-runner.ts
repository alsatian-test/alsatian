import { TapBark } from "tap-bark";
import { TestOutputStream, TestRunner, TestSet } from "../core/alsatian-core";
import { AlsatianCliOptions } from "./alsatian-cli-options";

export class CliTestRunner {
	public static create(): CliTestRunner {
		const outputStream = new TestOutputStream();
		const testRunner = new TestRunner(outputStream);
		return new CliTestRunner(testRunner);
	}

	public constructor(private testRunner: TestRunner) {
		if (!testRunner) {
			throw new TypeError("testRunner must not be null or undefined.");
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
			this.printHelp(packageJson.version);
			return;
		}

		// create test set from given file globs
		const testSet = await TestSet.create(userArguments.workingDirectory || undefined);
		testSet.addTestsFromFiles(userArguments.fileGlobs);

		if (userArguments.tap) {
			// if they want TAP output then just write to stdout directly
			this.testRunner.outputStream.pipe(process.stdout);
		} else {
			// otherwise create the tap bark reporter
			this.createTapBarkReporter(userArguments.hideProgress);
		}

		try {
			await this.testRunner.run(testSet, userArguments.timeout);
		} catch (error) {
			this.handleTestSetRunError(error);
		}
	}

	private createTapBarkReporter(hideProgressArgument: boolean) {
		const hideProgress = (process.env.CI || hideProgressArgument);
		const bark = TapBark.create(hideProgress === false);

		// pipe the reporter into stdout
		this.testRunner.outputStream
			.pipe(bark.getPipeable())
			.pipe(process.stdout);
	}

	private handleTestSetRunError(error: Error) {
		process.stderr.write(error.message + "\n");
		process.exit(1);
	}

	private printHelp(version: string) {
		process.stdout.write(
			"\n\n" +
				"alsatian version " +
				version +
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
	}
}
