import { Expect, TestCase, SpyOn, TestOutput } from "../../../core/alsatian-core";
import { OutputStreamBuilder } from "../../builders/output-stream-builder";
import { TestFixtureBuilder } from "../../builders/test-fixture-builder";

export class EmitFixtureTests {

    private static _getExpectedFixtureOutput(description: string): string {
        return `# FIXTURE ${description}\n`;
    }

    @TestCase("SomeTestFixtureName")
    @TestCase("AnotherTestFixture")
    @TestCase("lastOneIPromise")
    public shouldEmitCorrectFixtureInfo(description: string) {
        let outStream = new OutputStreamBuilder().build();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        let fixture = new TestFixtureBuilder()
            .withDescription(description)
            .build();

        testOutput.emitFixture(fixture);

        Expect(outStream.write).toHaveBeenCalledWith(
            EmitFixtureTests._getExpectedFixtureOutput(description)
        );
    }

}
