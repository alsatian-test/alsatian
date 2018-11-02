import { AlsatianCliOptions } from "../../../cli/alsatian-cli-options";
import { CliTestRunner } from "../../../cli/cli-test-runner";
import {
  AsyncTest,
  Expect,
  Setup,
  SpyOn,
  Teardown,
  TestCase,
  TestOutcome,
  TestRunner
} from "../../../core/alsatian-core";
import { TapBark } from "tap-bark";

export class CliTestRunnerTests {
  private _originalTestPlan: any;

  @Setup
  private _spyProcess() {
    this._originalTestPlan = Reflect.getMetadata("alsatian:test-plan", Expect);

    SpyOn(TapBark.tapParser, "on").andStub();
    SpyOn(process, "exit").andStub();
    SpyOn(process.stderr, "write").andStub();
    SpyOn(process.stdout, "write").andStub();
  }

  @Teardown
  private _resetProcess() {
    (process.exit as any).restore();
    (process.stdout.write as any).restore();
    (process.stderr.write as any).restore();
    (TapBark.tapParser.on as any).restore();
    Reflect.defineMetadata(
      "alsatian:test-plan",
      this._originalTestPlan,
      Expect
    );
  }

  @TestCase(null)
  @TestCase(undefined)
  public nullOrUndefinedTestRunnerThrowsError(testRunner: TestRunner) {
    Expect(() => new CliTestRunner(testRunner)).toThrowError(
      TypeError,
      "_testRunner must not be null or undefined."
    );
  }

  @AsyncTest()
  public async noTestFixturesExitsWithError() {
    const cliTestRunner = new CliTestRunner(new TestRunner());

    const cliOptions = new AlsatianCliOptions([]);

    await cliTestRunner.run(cliOptions);

    Expect(process.exit).toHaveBeenCalledWith(1);
  }

  @AsyncTest()
  public async noTestFixturesPrintsErrorMessageWithNewLine() {
    const cliTestRunner = new CliTestRunner(new TestRunner());

    const cliOptions = new AlsatianCliOptions([]);

    await cliTestRunner.run(cliOptions);

    Expect(process.stderr.write).toHaveBeenCalledWith("no tests to run.\n");
  }

  @AsyncTest()
  public async onePassingTestFixturesExitsWithNoError() {
    const testRunner = new TestRunner();

    const cliTestRunner = new CliTestRunner(testRunner);

    const testRunnerRunSpy = SpyOn(testRunner, "run");
    testRunnerRunSpy.andReturn(
      new Promise((cliResolve, cliReject) => {
        cliResolve();
      })
    );
    testRunnerRunSpy.andStub();

    const cliOptions = new AlsatianCliOptions([]);

    await cliTestRunner.run(cliOptions);

    Expect(process.exit).not.toHaveBeenCalledWith(1);
  }

  @AsyncTest()
  public async runThrowsErrorExitsWithError(outcome: TestOutcome) {
    const testRunner = new TestRunner();

    const cliTestRunner = new CliTestRunner(testRunner);

    const testRunnerRunSpy = SpyOn(testRunner, "run");
    testRunnerRunSpy.andCall(() => {
      throw new Error();
    });

    const cliOptions = new AlsatianCliOptions([]);

    await cliTestRunner.run(cliOptions);

    Expect(process.exit).toHaveBeenCalledWith(1);
  }

  @TestCase("something bad")
  @TestCase("another even worse thing")
  @TestCase("awfully terrible")
  @AsyncTest()
  public async runThrowsErrorOutputsErrorMessage(errorMessage: string) {
    const testRunner = new TestRunner();

    const cliTestRunner = new CliTestRunner(testRunner);

    const testRunnerRunSpy = SpyOn(testRunner, "run");
    testRunnerRunSpy.andCall(() => {
      throw new Error(errorMessage);
    });

    const cliOptions = new AlsatianCliOptions([]);

    await cliTestRunner.run(cliOptions);

    Expect(process.stderr.write).toHaveBeenCalledWith(errorMessage + "\n");
  }

  @AsyncTest()
  public async tapRequestedPipesOutputDirectlyToProcessStdOut() {
    const testRunner = new TestRunner();
    SpyOn(testRunner.outputStream, "pipe");

    const cliTestRunner = new CliTestRunner(testRunner);

    const testRunnerRunSpy = SpyOn(testRunner, "run");
    testRunnerRunSpy.andReturn(
      new Promise((cliResolve, cliReject) => {
        cliResolve();
      })
    );
    testRunnerRunSpy.andStub();

    const cliOptions = new AlsatianCliOptions(["--tap"]);

    await cliTestRunner.run(cliOptions);

    Expect(testRunner.outputStream.pipe).toHaveBeenCalledWith(process.stdout);
  }

  @AsyncTest()
  public async tapRequestedWithAliasPipesOutputDirectlyToProcessStdOut() {
    const testRunner = new TestRunner();
    SpyOn(testRunner.outputStream, "pipe");

    const cliTestRunner = new CliTestRunner(testRunner);

    const testRunnerRunSpy = SpyOn(testRunner, "run");
    testRunnerRunSpy.andReturn(
      new Promise((cliResolve, cliReject) => {
        cliResolve();
      })
    );
    testRunnerRunSpy.andStub();

    const cliOptions = new AlsatianCliOptions(["-T"]);

    await cliTestRunner.run(cliOptions);

    Expect(testRunner.outputStream.pipe).toHaveBeenCalledWith(process.stdout);
  }

  @AsyncTest()
  public async versionRequestedOutputsCurrentVersionNumber() {
    const testRunner = new TestRunner();
    SpyOn(testRunner.outputStream, "pipe");

    const cliTestRunner = new CliTestRunner(testRunner);

    SpyOn(testRunner, "run");

    const cliOptions = new AlsatianCliOptions(["--version"]);

    await cliTestRunner.run(cliOptions);

    Expect(process.stdout.write).toHaveBeenCalledWith(
      "alsatian version " + require("../../../../package.json").version
    );
  }

  @AsyncTest()
  public async versionRequestedWithAliasOutputsCurrentVersionNumber() {
    const testRunner = new TestRunner();
    SpyOn(testRunner.outputStream, "pipe");

    const cliTestRunner = new CliTestRunner(testRunner);

    SpyOn(testRunner, "run");

    const cliOptions = new AlsatianCliOptions(["-v"]);

    await cliTestRunner.run(cliOptions);

    Expect(process.stdout.write).toHaveBeenCalledWith(
      "alsatian version " + require("../../../../package.json").version
    );
  }

  @AsyncTest()
  public async versionRequestedDoesntCallTestRunnerRun() {
    const testRunner = new TestRunner();
    SpyOn(testRunner.outputStream, "pipe");

    const cliTestRunner = new CliTestRunner(testRunner);

    SpyOn(testRunner, "run");

    const cliOptions = new AlsatianCliOptions(["--version"]);

    await cliTestRunner.run(cliOptions);

    Expect(testRunner.run).not.toHaveBeenCalled();
  }

  @AsyncTest()
  public async versionRequestedWithAliasPipesOutputDirectlyToProcessStdOut() {
    const testRunner = new TestRunner();
    SpyOn(testRunner.outputStream, "pipe");

    const cliTestRunner = new CliTestRunner(testRunner);

    SpyOn(testRunner, "run");

    const cliOptions = new AlsatianCliOptions(["--version"]);

    await cliTestRunner.run(cliOptions);

    Expect(testRunner.run).not.toHaveBeenCalled();
  }

  @AsyncTest()
  public async helpRequestedOutputsCurrentVersionNumber() {
    const testRunner = new TestRunner();
    SpyOn(testRunner.outputStream, "pipe");

    const cliTestRunner = new CliTestRunner(testRunner);

    SpyOn(testRunner, "run");

    const cliOptions = new AlsatianCliOptions(["--help"]);

    await cliTestRunner.run(cliOptions);

    Expect(process.stdout.write).toHaveBeenCalledWith(
      "\n\n" +
        "alsatian version " +
        require("../../../../package.json").version +
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
        "HIDE PROGRESS: --hide-progress / -H (hides progress from console)\n" +
        "\n"
    );
  }

  @AsyncTest()
  public async helpRequestedWithAliasOutputsCurrentVersionNumber() {
    const testRunner = new TestRunner();
    SpyOn(testRunner.outputStream, "pipe");

    const cliTestRunner = new CliTestRunner(testRunner);

    SpyOn(testRunner, "run");

    const cliOptions = new AlsatianCliOptions(["-h"]);

    await cliTestRunner.run(cliOptions);

    Expect(process.stdout.write).toHaveBeenCalledWith(
      "\n\n" +
        "alsatian version " +
        require("../../../../package.json").version +
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
        "HIDE PROGRESS: --hide-progress / -H (hides progress from console)\n" +
        "\n"
    );
  }

  @AsyncTest()
  public async helpRequestedDoesntCallTestRunnerRun() {
    const testRunner = new TestRunner();
    SpyOn(testRunner.outputStream, "pipe");

    const cliTestRunner = new CliTestRunner(testRunner);

    SpyOn(testRunner, "run");

    const cliOptions = new AlsatianCliOptions(["--help"]);

    await cliTestRunner.run(cliOptions);

    Expect(testRunner.run).not.toHaveBeenCalled();
  }

  @AsyncTest()
  public async helpRequestedWithAliasPipesOutputDirectlyToProcessStdOut() {
    const testRunner = new TestRunner();
    SpyOn(testRunner.outputStream, "pipe");

    const cliTestRunner = new CliTestRunner(testRunner);

    SpyOn(testRunner, "run");

    const cliOptions = new AlsatianCliOptions(["-h"]);

    await cliTestRunner.run(cliOptions);

    Expect(testRunner.run).not.toHaveBeenCalled();
  }
}
