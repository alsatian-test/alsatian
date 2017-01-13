import * as child from "child_process";
import * as path from "path";
import { Expect, AsyncTest, TestCase, Timeout } from "../../../core/alsatian-core";
import * as FileSystem from "fs";

export class GulpIntegrationTests {

   @AsyncTest()
   @Timeout(3000)
   public toBeExpectations() {

      const result = child.exec("gulp test-expectations --gulpfile \"./test/integration-tests/gulp/gulpfile.js\" --cwd ./");

      let consoleOutput = "";

      result.stdout.on("data", (data) => consoleOutput += data);
      result.stderr.on("data", (data) => consoleOutput += data);

      let expectedOutput = FileSystem.readFileSync("./test/integration-tests/expected-output/expectations/to-be.txt").toString();

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
   @Timeout(3000)
   public syntaxTests(syntaxTestName: string) {

      const result = child.exec("gulp test-syntax --gulpfile \"./test/integration-tests/gulp/gulpfile.js\" --cwd ./");

      let consoleOutput = "";

      result.stdout.on("data", (data) => consoleOutput += data);
      result.stderr.on("data", (data) => consoleOutput += data);

      let expectedOutput = FileSystem.readFileSync("./test/integration-tests/expected-output/test-syntax/all-test-syntax.txt").toString();

      return new Promise<void>((resolve, reject) => {
         result.on("close", (code: number) => {
            Expect(consoleOutput).toContain(expectedOutput.replace(/\r/g, ""));
            resolve();
         });
      });
   }
}
