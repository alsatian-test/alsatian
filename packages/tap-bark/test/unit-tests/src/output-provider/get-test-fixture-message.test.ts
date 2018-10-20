import { Test, TestCase, Expect, SpyOn } from "alsatian";
import { OutputProviderBuilder } from "../../../_builders/output-provider-builder";
import { ResultType } from "../../../../src/result-type";

export class GetTestFixtureMessage {
  @TestCase("Some Test Fixture")
  @TestCase("Another Test Fixture Name Here")
  public shouldReturnCorrectMessageForTestFixture(name: string) {
    const provider = new OutputProviderBuilder().build();
    const expected = `# [${name}]`;
    const actual = provider.getTestFixtureMessage(name);

    Expect(actual).toBe(expected);
  }
}
