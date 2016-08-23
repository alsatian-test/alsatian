import { Expect, Test, TestCase } from "../../../../core/alsatian-core";
import { AlsatianCliOptions } from "../../../../cli/alsatian-cli-options";

export class FileGlobsTests {

   @Test()
   public fileGlobsDefaultToEmpty() {
      const options = new AlsatianCliOptions([]);

      Expect(options.fileGlobs.length).toBe(0);
   }

   @TestCase("file.ts")
   @TestCase(".//*.css")
   @TestCase(".//path/**/*.js")
   public fileGlobSet(...expectedFileGlobs: Array<string>) {
      const options = new AlsatianCliOptions(expectedFileGlobs);

      Expect(options.fileGlobs).toEqual(expectedFileGlobs);
   }

   @TestCase("file.ts", "./another-path/to/find/files.ts")
   @TestCase(".//*.css", "./**/more/*.css", "/another*/location.css")
   @TestCase(".//path/**/*.js", "more.js", "./again/and/again.js", "./**/*.finally.js")
   public multipleFileGlobSet(...expectedFileGlobs: Array<string>) {
      const options = new AlsatianCliOptions(expectedFileGlobs);

      Expect(options.fileGlobs).toEqual(expectedFileGlobs);
   }

   @TestCase([ "file.ts", "./another-path/to/find/files.ts", "--timeout", "1" ], [ "file.ts", "./another-path/to/find/files.ts" ])
   @TestCase([ ".//*.css", "-t", "42", "./**/more/*.css", "/another*/location.css" ], [ ".//*.css", "./**/more/*.css", "/another*/location.css" ])
   public knownArgumentsIgnoredFromFileGlobs(inputArguments: Array<string>, expectedFileGlobs: Array<string>) {
      const options = new AlsatianCliOptions(inputArguments);

      Expect(options.fileGlobs).toEqual(expectedFileGlobs);
   }
}
