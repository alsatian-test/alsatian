import * as child from "child_process";
import * as path from "path";
import { Expect, Test } from "../../../core/alsatian-core";

export class CliIntegrationTests {
   @Test()
   public proofOfConcept() {

      const result = child.exec("alsatian ./test/integration-tests/node/tests/**/*.spec.js", { cwd: process.cwd() });

      Expect(result.stderr).toBeDefined();
   }
}
