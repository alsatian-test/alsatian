import * as child from "child_process";
import * as path from "path";
import { Promise } from "../../../promise/promise";
import { Expect, AsyncTest } from "../../../core/alsatian-core";
import * as FileSystem from "fs";

export class CliIntegrationTests {

   @AsyncTest()
   public proofOfConcept() {

      const result = child.exec("alsatian ./test/integration-tests/node/tests/**/*.spec.js  --tap");

      let consoleOutput = "";

      result.stdout.on("data", (data) => consoleOutput += data);
      result.stderr.on("data", (data) => consoleOutput += data);

      let expectedOutput = FileSystem.readFileSync("./test/integration-tests/expected-output/proof-of-concept.txt").toString();

      return new Promise((resolve, reject) => {
         result.on("close", (code: number) => {
            Expect(consoleOutput).toBe(expectedOutput.replace(/\r/g, ""));

            resolve();
         });
      });
   }
}
