import { Expect, Test, TestCase } from "../../../../core/alsatian-core";
import { AlsatianCliOptions } from "../../../../cli/alsatian-cli-options";
import { DuplicateCliArgumentError } from "../../../../cli/errors/duplicate-cli-argument-error";

export class HelpRequestedTests {

   @Test()
   public helpRequestedDefaultsToFalse() {
      const options = new AlsatianCliOptions([]);

      Expect(options.helpRequested).toBe(false);
   }

   @TestCase("--help")
   @TestCase("-h")
   public helpRequestedIfCalled(argument: string) {
      const options = new AlsatianCliOptions([ argument ]);

      Expect(options.helpRequested).toBe(true);
   }

   @TestCase("--help", "-h")
   @TestCase("--help", "--help")
   @TestCase("-h", "-h")
   public duplicateTapArgumentsThrowsError(firstArgument: string, secondArgument: string) {
      Expect(() => {
         new AlsatianCliOptions([ firstArgument, secondArgument ]);
      }).toThrowError(DuplicateCliArgumentError, "Duplicate \"help\" arguments were provided.");
   }

   @TestCase("--help", "/test/location.spec.js")
   @TestCase("/another/set/of/**/*.spec.js", "-h")
   public helpRequestedVeforeOrAfterGlobIsTrue(firstArgument: string, secondArgument: string) {
      const options = new AlsatianCliOptions([ firstArgument, secondArgument ]);

      Expect(options.helpRequested).toBe(true);
   }
}
