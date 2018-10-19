import { Test, TestCase, Expect, SpyOn } from "alsatian";
import { OutputProviderBuilder } from "../../../_builders/output-provider-builder";
import { ResultType } from "../../../../src/result-type";

export class GetTestMessage {
  @TestCase("shouldPerformExpectedBehaviour")
  @TestCase("Test Of Some Function")
  public shouldReturnCorrectMessageForTestFixture(name: string) {
    const provider = new OutputProviderBuilder().build();
    const expected = ` --- ${name}`;
    const actual = provider.getTestMessage(name);

    Expect(actual).toBe(expected);
  }
}
