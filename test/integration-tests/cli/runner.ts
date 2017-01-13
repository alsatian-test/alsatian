import * as child from "child_process";
import * as FileSystem from "fs";
import * as path from "path";
import { AsyncTest, Expect } from "../../../core/alsatian-core";
import { Promise } from "../../../promise/promise";

export class CliIntegrationTests {

   @AsyncTest()
   public toBeExpectations() {

      const result = child.exec("alsatian ./test/integration-tests/test-sets/expectations/to-be.expect.js --tap");

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
}
