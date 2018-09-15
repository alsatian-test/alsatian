import { Test, TestCase, Expect, SpyOn } from "alsatian";
import { OutputProviderBuilder } from "../../../_builders/output-provider-builder";
import { ResultType } from "../../../../src/result-type";

export class GetTestFixtureMessage {

    @TestCase("Some Test Fixture")
    @TestCase("Another Test Fixture Name Here")
    public shouldReturnCorrectMessageForTestFixture(name: string) {
        let provider = new OutputProviderBuilder().build();
        let expected = `# [${name}]`;
        let actual = provider.getTestFixtureMessage(name);

        Expect(actual).toBe(expected);
    }

}
