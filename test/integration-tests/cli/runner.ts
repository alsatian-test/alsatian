import * as child from "child_process";
import * as path from "path";
import { Expect, Test } from "../../../core/alsatian-core";

export class CliIntegrationTests {
   @Test()
   public proofOfConcept() {

      const result = child.exec("alsatian ./test/integration-tests/node/tests/**/*.spec.js");

      Expect(result.on("exit or something", () => {})).toBeDefined();
   }
}
