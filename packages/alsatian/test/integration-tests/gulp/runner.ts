import * as child from "child_process";
import * as FileSystem from "fs";
import * as path from "path";
import {
  AsyncTest,
  Expect,
  TestCase,
  Timeout
} from "../../../core/alsatian-core";

export class GulpIntegrationTests {
  @AsyncTest()
  @Timeout(10000)
  public toBeExpectations() {
    const result = child.exec(
      'gulp test-to-be-expectations --gulpfile "./dist/test/integration-tests/gulp/gulpfile.js" --cwd ./'
    );

    let consoleOutput = "";

    result.stdout.on("data", (data: string) => (consoleOutput += data));
    result.stderr.on("data", (data: string) => (consoleOutput += data));

    const expectedOutput = FileSystem.readFileSync(
      "./test/integration-tests/expected-output/expectations/to-be.txt"
    ).toString();

    return new Promise<void>((resolve, reject) => {
      result.on("close", (code: number) => {
        Expect(consoleOutput).toContain(expectedOutput.replace(/\r/g, ""));
        resolve();
      });
    });
  }

  @AsyncTest()
  @Timeout(10000)
  public toThrowExpectations() {
    const result = child.exec(
      'gulp test-to-throw-expectations --gulpfile "./dist/test/integration-tests/gulp/gulpfile.js" --cwd ./'
    );

    let consoleOutput = "";

    result.stdout.on("data", (data: string) => (consoleOutput += data));
    result.stderr.on("data", (data: string) => (consoleOutput += data));

    const expectedOutput = FileSystem.readFileSync(
      "./test/integration-tests/expected-output/expectations/to-throw.txt"
    ).toString();

    return new Promise<void>((resolve, reject) => {
      result.on("close", (code: number) => {
        Expect(consoleOutput).toContain(expectedOutput.replace(/\r/g, ""));
        resolve();
      });
    });
  }

  @TestCase("async-test")
  @TestCase("setup")
  @TestCase("teardown")
  @AsyncTest()
  @Timeout(10000)
  public syntaxTests(syntaxTestName: string) {
    const result = child.exec(
      'gulp test-syntax --gulpfile "./dist/test/integration-tests/gulp/gulpfile.js" --cwd ./'
    );

    let consoleOutput = "";

    result.stdout.on("data", (data: string) => (consoleOutput += data));
    result.stderr.on("data", (data: string) => (consoleOutput += data));

    const expectedOutput = FileSystem.readFileSync(
      "./test/integration-tests/expected-output/test-syntax/all-test-syntax.txt"
    ).toString();

    return new Promise<void>((resolve, reject) => {
      result.on("close", (code: number) => {
        Expect(consoleOutput).toContain(expectedOutput.replace(/\r/g, ""));
        resolve();
      });
    });
  }
}
