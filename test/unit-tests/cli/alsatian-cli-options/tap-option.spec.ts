import { Expect, Test, IgnoreTests } from "../../../../core/alsatian-core";
import { AlsatianCliOptions } from "../../../../cli/alsatian-cli-options";
import { DuplicateCliArgumentError } from "../../../../cli/errors/duplicate-cli-argument-error";

export class TapOptionTests {

   @Test()
   public tapDefaultsToFalse() {
      const options = new AlsatianCliOptions([]);

      Expect(options.tap).toBe(false);
   }

   @Test()
   public tapTrueIfCalled(timeout: string) {
      const options = new AlsatianCliOptions([ "--tap" ]);

      Expect(options.tap).toBe(true);
   }

   @Test()
   public duplicateTapArgumentsThrowsError() {
      Expect(() => {
        new AlsatianCliOptions([ "--tap", "--tap" ]);
      }).toThrowError(DuplicateCliArgumentError, "Duplicate \"tap\" arguments were provided.");
   }

}
