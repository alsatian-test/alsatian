import { AlsatianCliOptions } from "../../../../cli/alsatian-cli-options";
import { InvalidArgumentNamesError } from "../../../../cli/errors/invalid-argument-names-error";
import { Expect, TestCase } from "../../../../core/alsatian-core";

export class UnknownArgumentsTests {
  @TestCase("--unknown", 'unrecognised argument "unknown".')
  @TestCase("-q", 'unrecognised argument "q".')
  @TestCase("--weird-er", 'unrecognised argument "weird-er".')
  @TestCase("-X", 'unrecognised argument "X".')
  public unknownArgumentThrowsError(
    unknownArgument: string,
    expectedMessage: string
  ) {
    Expect(() => new AlsatianCliOptions([unknownArgument])).toThrowError(
      InvalidArgumentNamesError,
      expectedMessage
    );
  }

  @TestCase(["--unknown", "-q"], 'unrecognised arguments "unknown" and "q".')
  @TestCase(
    ["--weird", "-X", "--unknown-arg"],
    'unrecognised arguments "weird" and "X" and "unknown-arg".'
  )
  public multipleUnknownArgumentsThrowsError(
    unknownArguments: Array<string>,
    expectedMessage: string
  ) {
    Expect(() => new AlsatianCliOptions(unknownArguments)).toThrowError(
      InvalidArgumentNamesError,
      expectedMessage
    );
  }
}
