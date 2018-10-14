import { Test, TestCase, Expect, SpyOn } from "alsatian";
import { OutputProviderBuilder } from "../../../_builders/output-provider-builder";
import { ResultType } from "../../../../src/result-type";
const chalk = require("chalk");

export class GetResultMessageTests {
  @TestCase(5, 10)
  @TestCase(20, 50)
  @TestCase(100, 200)
  public shouldReturnCorrectMessageForPass(passes: number, total: number) {
    const provider = new OutputProviderBuilder().build();
    const expected = chalk.green(`Pass: ${passes}/${total}`);
    const actual = provider.getResultMessage(ResultType.PASS, passes, total);

    Expect(actual).toBe(expected);
  }

  @TestCase(5, 10)
  @TestCase(20, 50)
  @TestCase(100, 200)
  public shouldReturnCorrectMessageForFail(failures: number, total: number) {
    const provider = new OutputProviderBuilder().build();
    const expected = chalk.red(`Fail: ${failures}/${total}`);
    const actual = provider.getResultMessage(ResultType.FAIL, failures, total);

    Expect(actual).toBe(expected);
  }

  @TestCase(5, 10)
  @TestCase(20, 50)
  @TestCase(100, 200)
  public shouldReturnCorrectMessageForIgnored(ignores: number, total: number) {
    const provider = new OutputProviderBuilder().build();
    const expected = chalk.yellow(`Ignore: ${ignores}/${total}`);
    const actual = provider.getResultMessage(ResultType.IGNORE, ignores, total);

    Expect(actual).toBe(expected);
  }

  @TestCase(5)
  @TestCase(20)
  @TestCase(100)
  public shouldThrowForUnknownresultType(resultType: number) {
    const provider = new OutputProviderBuilder().build();

    Expect(() => provider.getResultMessage(resultType, 42, 42)).toThrowError(
      TypeError,
      "Invalid ResultType."
    );
  }
}
