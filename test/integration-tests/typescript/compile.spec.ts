import * as child from "child_process";
import * as path from "path";
import { AsyncTest, TestFixture, TestCase, Expect, Timeout } from "../../../core/alsatian-core";

@TestFixture("TypeScript compiler tests")
export class TypeScriptCompilerTests {

   @TestCase("es3")
   @TestCase("es5")
   @TestCase("es6")
   @TestCase("es2015")
   @AsyncTest("Compiler supports all targets")
   @Timeout(5000)
   public targetBuildCompiles(target: string) {

      const result = child.exec("tsc -p ./tsconfig.json --target " + target);

      return new Promise<void>((resolve, reject) => {
         result.on("close", (code: number) => {
            Expect(code).toBe(0);
            resolve();
         });
      });
   }
}
