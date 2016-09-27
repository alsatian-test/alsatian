import { Expect, Test, TestCase } from "../../../../core/alsatian-core";
import { AlsatianCliOptions } from "../../../../cli/alsatian-cli-options";
import { DuplicateCliArgumentError } from "../../../../cli/errors/duplicate-cli-argument-error";

export class TapOptionTests {

   @Test()
   public tapDefaultsToFalse() {
      const options = new AlsatianCliOptions([]);

      Expect(options.tap).toBe(false);
   }

   @TestCase("--tap")
   @TestCase("-T")
   public tapTrueIfCalled(argument: string) {
      const options = new AlsatianCliOptions([ argument ]);

      Expect(options.tap).toBe(true);
   }

   @TestCase("--tap", "-T")
   @TestCase("--tap", "--tap")
   @TestCase("-T", "-T")
   public duplicateTapArgumentsThrowsError(firstArgument: string, secondArgument: string) {
      Expect(() => {
        new AlsatianCliOptions([ firstArgument, secondArgument ]);
      }).toThrowError(DuplicateCliArgumentError, "Duplicate \"tap\" arguments were provided.");
   }

}
