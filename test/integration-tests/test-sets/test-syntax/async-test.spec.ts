import { TestFixture, Expect, AsyncTest } from "../../../../core/alsatian-core";

@TestFixture("asynchronous tests")
export class AsyncTests {

  private async _asyncFunction(): Promise<number> {
       return new Promise<number>((resolve, reject) => {
           resolve(4);
       });
   }

   @AsyncTest()
   private async passingAsyncTest() {
       const result = await this._asyncFunction();
       Expect(result).toBe(4);
   }

   @AsyncTest()
   private async failingAsyncTest() {
       const result = await this._asyncFunction();
       Expect(result).toBe(5);
   }
}


   