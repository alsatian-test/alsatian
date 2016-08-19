import { Expect, TestCase, SpyOn, TestOutput } from "../../../core/alsatian-core";
import { OutputStreamBuilder } from "../../builders/output-stream-builder";

export class EmitFixtureTests {

    private static _getExpectedFixtureOutput(fixtureName: string): string {
        return `# FIXTURE ${fixtureName}\n`;
    }

    @TestCase("SomeTestFixtureName")
    @TestCase("AnotherTestFixture")
    @TestCase("lastOneIPromise")
    public shouldEmitCorrectFixtureInfo(fixtureName: string) {
        let outStream = new OutputStreamBuilder().build();
        SpyOn(outStream, "write");

        let testOutput = new TestOutput(outStream);

        testOutput.emitFixture(fixtureName);

        Expect(outStream.write).toHaveBeenCalledWith(
            EmitFixtureTests._getExpectedFixtureOutput(fixtureName)
        );
    }

}
