import * as child from "child_process";
import * as FileSystem from "fs";
import * as path from "path";
import {
  AsyncTest,
  Expect,
  TestCase,
  Timeout
} from "../../../core/alsatian-core";

export class CliIntegrationTests {
  @AsyncTest()
  public async tapWithTimeoutDoesNotDelayShutdown() {
    const result = child.exec(
      `alsatian ` +
        `./test/integration-tests/cli/single.spec.js` +
        `--tap` +
        `--timeout` +
        `9999`
    );
    // This does not test aything other than it will timeout, because
    // it's awaiting the timeouts set in test-item (for 9999 seconds)
    return new Promise<void>((resolve, reject) => {
      result.on("close", (code: number) => {
        resolve();
      });
    });
  }
}
