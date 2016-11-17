import * as child from "child_process";
import * as path from "path";
import { Promise } from "../../../promise/promise";
import { Expect, AsyncTest, Timeout } from "../../../core/alsatian-core";
import * as FileSystem from "fs";

export class GulpIntegrationTests {

   @AsyncTest()
   @Timeout(2000)
   public toBeExpectations() {

      const result = child.exec("gulp test-expectations --gulpfile \"./test/integration-tests/gulp/gulpfile.js\" --cwd ./");

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
