import { Expect, Test, TestCase } from "../../../../core/alsatian-core";
import { AlsatianCliOptions } from "../../../../cli/alsatian-cli-options";
import { DuplicateCliArgumentError } from "../../../../cli/errors/duplicate-cli-argument-error";

export class VersionRequestedTests {

   @Test()
   public versionRequestedDefaultsToFalse() {
      const options = new AlsatianCliOptions([]);

      Expect(options.versionRequested).toBe(false);
   }

   @TestCase("--version")
   @TestCase("-v")
   public tapTrueIfCalled(argument: string) {
      const options = new AlsatianCliOptions([ argument ]);

      Expect(options.versionRequested).toBe(true);
   }

   @TestCase("--version", "-v")
   @TestCase("--version", "--version")
   @TestCase("-v", "-v")
   public duplicateTapArgumentsThrowsError(firstArgument: string, secondArgument: string) {
      Expect(() => {
        new AlsatianCliOptions([ firstArgument, secondArgument ]);
      }).toThrowError(DuplicateCliArgumentError, "Duplicate \"version\" arguments were provided.");
   }
}
