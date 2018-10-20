import * as child from "child_process";
import * as path from "path";
import {
  AsyncTest,
  Expect,
  TestCase,
  TestFixture,
  Timeout
} from "../../../core/alsatian-core";

@TestFixture("TypeScript compiler tests")
export class TypeScriptCompilerTests {
  @TestCase("es3")
  @TestCase("es5")
  @TestCase("es6")
  @TestCase("es2015")
  @AsyncTest("Compiler supports all targets")
  @Timeout(5000)
  public targetBuildCompiles(target: string) {
    const result = child.exec(
      "tsc -p ./test/integration-tests/typescript --target " + target
    );

    let consoleOutput = "";

    result.stdout.on("data", (data: string) => (consoleOutput += data));
    result.stderr.on("data", (data: string) => (consoleOutput += data));

    return new Promise<void>((resolve, reject) => {
      result.on("close", (code: number) => {
        // console.log(consoleOutput);
        Expect(code).toBe(0);
        resolve();
      });
    });
  }
}
