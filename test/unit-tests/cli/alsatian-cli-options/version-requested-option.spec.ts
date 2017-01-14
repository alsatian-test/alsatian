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
   public versionRequestedIfCalled(argument: string) {
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

   @TestCase("--version", "/test/location.spec.js")
   @TestCase("/another/set/of/**/*.spec.js", "-v")
   public versionRequestedBeforeOrAfterGlobIsTrue(firstArgument: string, secondArgument: string) {
      const options = new AlsatianCliOptions([ firstArgument, secondArgument ]);

      Expect(options.versionRequested).toBe(true);
   }
}
