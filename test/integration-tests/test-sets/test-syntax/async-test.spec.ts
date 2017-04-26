import { AsyncTest, Expect, TestFixture } from "../../../../core/alsatian-core";

@TestFixture("asynchronous tests")
export class AsyncTests {

   private async _asyncFunction(): Promise<number> {
       return new Promise<number>((resolve, reject) => {
           resolve(4);
       });
   }

   @AsyncTest("simple passing asynchronous test")
   public async passingAsyncTest() {
       const result = await this._asyncFunction();
       Expect(result).toBe(4);
   }

   @AsyncTest("simple failing asynchronous test")
   public async failingAsyncTest() {
       const result = await this._asyncFunction();
       Expect(result).toBe(5);
   }
}
