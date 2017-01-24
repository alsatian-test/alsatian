import { Expect, Test } from "../../../core/alsatian-core";
import { EmptyMatchError } from "../../../core/errors/empty-match-error";

export class EmptyMatchErrorTests {

   @Test()
   public shouldBeEmptyMessage() {
      let error = new EmptyMatchError([], true);

      Expect(error.message).toBe(`Expected "${JSON.stringify([])}" to be empty.`);
   }

   @Test()
   public shouldNotBeEmptyMessage() {
      let error = new EmptyMatchError([], false);

      Expect(error.message).toBe(`Expected "${JSON.stringify([])}" not to be empty.`);
   }
}
