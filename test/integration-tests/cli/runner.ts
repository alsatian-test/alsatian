import * as child from "child_process";
import * as FileSystem from "fs";
import * as path from "path";
import { AsyncTest, Expect, TestCase, Timeout } from "../../../core/alsatian-core";

export class CliIntegrationTests {

   @TestCase("to-be")
   @AsyncTest()
   @Timeout(5000)
   public toBeExpectations(expectationTestName: string) {

      const result = child
                    .exec(`alsatian ` +
                          `./test/integration-tests/test-sets/expectations/${expectationTestName}.spec.js` +
                          ` --tap`);

      let consoleOutput = "";

      result.stdout.on("data", (data) => consoleOutput += data);
      result.stderr.on("data", (data) => consoleOutput += data);

      let expectedOutput = FileSystem
                              .readFileSync(`./test/integration-tests/expected-output/` +
                                            `expectations/${expectationTestName}.txt`)
                              .toString();

      return new Promise<void>((resolve, reject) => {
         result.on("close", (code: number) => {
            Expect(consoleOutput).toBe(expectedOutput.replace(/\r/g, ""));
            resolve();
         });
      });
   }

   @TestCase("async-test")
   @TestCase("setup")
   @TestCase("teardown")
   @TestCase("case-arguments")
   @AsyncTest()
   @Timeout(5000)
   public syntaxTests(syntaxTestName: string) {

      const result = child
                    .exec(`alsatian ` +
                          `./test/integration-tests/test-sets/test-syntax/${syntaxTestName}*.spec.js ` +
                          `--tap`);

      let consoleOutput = "";

      result.stdout.on("data", (data) => consoleOutput += data);
      result.stderr.on("data", (data) => consoleOutput += data);

      let expectedOutput = FileSystem
                            .readFileSync(`./test/integration-tests/expected-output/test-syntax/${syntaxTestName}.txt`)
                            .toString();

      return new Promise<void>((resolve, reject) => {
         result.on("close", (code: number) => {
            Expect(consoleOutput).toBe(expectedOutput.replace(/\r/g, ""));
            resolve();
         });
      });
   }
}
