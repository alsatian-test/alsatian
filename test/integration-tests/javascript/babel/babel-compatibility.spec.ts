import * as child from "child_process";
import * as path from "path";
import { Promise } from "../../../../promise/promise";
import { Expect, AsyncTest } from "../../../../core/alsatian-core";
import * as FileSystem from "fs";

export class BabelIntegrationTests {

   @AsyncTest()
   public toBeExpectations() {

      const result = child.exec("alsatian ./test/integration-tests/javascript/test-sets/expectations/to-be.spec.js --tap");

      let consoleOutput = "";

      result.stdout.on("data", (data) => consoleOutput += data);
      result.stderr.on("data", (data) => consoleOutput += data);

      let expectedOutput = FileSystem.readFileSync("./test/integration-tests/expected-output/expectations/to-be.txt").toString();

      return new Promise((resolve, reject) => {
         result.on("close", (code: number) => {
            Expect(consoleOutput).toBe(expectedOutput.replace(/\r/g, ""));
            resolve();
         });
      });
   }

   @AsyncTest()
   public asyncTest() {

      const result = child.exec("alsatian ./test/integration-tests/javascript/test-sets/test-syntax/async-test.js --tap");

      let consoleOutput = "";

      result.stdout.on("data", (data) => consoleOutput += data);
      result.stderr.on("data", (data) => consoleOutput += data);

      let expectedOutput = FileSystem.readFileSync("./test/integration-tests/expected-output/expectations/async-test.txt").toString();

      return new Promise((resolve, reject) => {
         result.on("close", (code: number) => {
            Expect(consoleOutput).toBe(expectedOutput.replace(/\r/g, ""));
            resolve();
         });
      });
   }
}
