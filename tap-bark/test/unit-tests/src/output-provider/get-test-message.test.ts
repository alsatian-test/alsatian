import { Test, TestCase, Expect, SpyOn } from "alsatian";
import { OutputProviderBuilder } from "../../../_builders/output-provider-builder";
import { ResultType } from "../../../../src/result-type";

export class GetTestMessage {

    @TestCase("shouldPerformExpectedBehaviour")
    @TestCase("Test Of Some Function")
    public shouldReturnCorrectMessageForTestFixture(name: string) {
        let provider = new OutputProviderBuilder().build();
        let expected = ` --- ${name}`;
        let actual = provider.getTestMessage(name);

        Expect(actual).toBe(expected);
    }

}
